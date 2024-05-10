﻿
namespace TrashMobMobile.ViewModels;

#nullable enable

using CommunityToolkit.Mvvm.ComponentModel;
using System.Collections.ObjectModel;
using System.Windows.Input;
using TrashMob.Models;
using TrashMobMobile.Data;
using TrashMobMobile.Extensions;

public partial class ViewEventViewModel : BaseViewModel
{
    private readonly IMobEventManager mobEventManager;
    private readonly IEventTypeRestService eventTypeRestService;
    private readonly IWaiverManager waiverManager;
    private readonly IEventAttendeeRestService eventAttendeeRestService;

    public ViewEventViewModel(IMobEventManager mobEventManager, 
                              IEventTypeRestService eventTypeRestService,
                              IWaiverManager waiverManager,
                              IEventAttendeeRestService eventAttendeeRestService)
    {
        RegisterCommand = new Command(async () => await Register());
        UnregisterCommand = new Command(async () => await Unregister());
        EditEventCommand = new Command(async () => await EditEvent());
        ViewEventSummaryCommand = new Command(async () => await ViewEventSummary());
        this.mobEventManager = mobEventManager;
        this.eventTypeRestService = eventTypeRestService;
        this.waiverManager = waiverManager;
        this.eventAttendeeRestService = eventAttendeeRestService;
    }

    [ObservableProperty]
    EventViewModel eventViewModel;

    [ObservableProperty]
    bool enableRegister;

    [ObservableProperty]
    bool enableUnregister;

    [ObservableProperty]
    bool enableEditEvent;

    [ObservableProperty]
    bool enableViewEventSummary;

    [ObservableProperty]
    string selectedEventType;

    [ObservableProperty]
    string whatToExpect;

    [ObservableProperty]
    string attendeeCount;

    [ObservableProperty]
    string spotsLeft;

    [ObservableProperty]
    double overlayOpacity;

    public ObservableCollection<EventViewModel> Events { get; set; } = [];

    public ICommand RegisterCommand { get; set; }

    public ICommand UnregisterCommand { get; set; }

    public ICommand EditEventCommand { get; set; }

    public ICommand ViewEventSummaryCommand { get; set; }

    public async Task Init(Guid eventId)
    {
        IsBusy = true;
        OverlayOpacity = 0.25; // Workaround for: https://github.com/dotnet/maui/issues/18234

        var mobEvent = await mobEventManager.GetEventAsync(eventId);

        EventViewModel = mobEvent.ToEventViewModel();

        var eventTypes = (await eventTypeRestService.GetEventTypesAsync()).ToList();
        SelectedEventType = eventTypes.First(et => et.Id == mobEvent.EventTypeId).Name;
        
        Events.Clear();
        Events.Add(EventViewModel);
        var isAttending = await mobEventManager.IsUserAttendingAsync(eventId, App.CurrentUser.Id);

        EnableRegister = !mobEvent.IsEventLead() && !isAttending && mobEvent.AreNewRegistrationsAllowed();
        EnableUnregister = !mobEvent.IsEventLead() && isAttending && mobEvent.AreUnregistrationsAllowed();
        EnableEditEvent = mobEvent.IsEventLead();
        EnableViewEventSummary = mobEvent.IsCompleted();

        WhatToExpect = "What to Expect: \nCleanup supplies provided\nMeet fellow community members\nContribute to a cleaner environment.";

        var attendees = await eventAttendeeRestService.GetEventAttendeesAsync(eventId);

        if (attendees.Count() == 1)
        {
            AttendeeCount = $"{attendees.Count()} person is going!";
        }
        else
        {
            AttendeeCount = "{attendees.Count()} people are going!";
        }

        if (mobEvent.MaxNumberOfParticipants > 0)
        {
            if (mobEvent.MaxNumberOfParticipants - attendees.Count() > 0)
            {
                SpotsLeft = $"{mobEvent.MaxNumberOfParticipants - attendees.Count()} spot left!";
            }
            else
            {
                SpotsLeft = "We're sorry. This event is currently full.";
            }
        }
        else
        {
            SpotsLeft = "";
        }

        IsBusy = false;
    }

    private async Task EditEvent()
    {
        await Shell.Current.GoToAsync($"{nameof(EditEventPage)}?EventId={eventViewModel.Id}");
    }

    private async Task ViewEventSummary()
    {
        await Shell.Current.GoToAsync($"{nameof(ViewEventSummaryPage)}?EventId={eventViewModel.Id}");
    }

    private async Task Register()
    {
        IsBusy = true;

        if (!await waiverManager.HasUserSignedTrashMobWaiverAsync())
        {
            await Shell.Current.GoToAsync($"{nameof(WaiverPage)}");
        }

        var eventAttendee = new EventAttendee()
        {
            EventId = EventViewModel.Id,
            UserId = App.CurrentUser.Id
        };

        await mobEventManager.AddEventAttendeeAsync(eventAttendee);

        IsBusy = false;

        await Notify("You have been registered for this event.");
    }

    private async Task Unregister()
    {
        IsBusy = true;

        var eventAttendee = new EventAttendee()
        {
            EventId = EventViewModel.Id,
            UserId = App.CurrentUser.Id
        };

        await mobEventManager.RemoveEventAttendeeAsync(eventAttendee);

        IsBusy = false;

        await Notify("You have been unregistered for this event.");
    }
}
