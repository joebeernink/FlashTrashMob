﻿namespace TrashMobMobile.ViewModels;

using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Windows.Input;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Color = Microsoft.Maui.Graphics.Color;
using TrashMob.Models;
using TrashMobMobile.Extensions;
using TrashMobMobile.Services;
using TrashMobMobile.Pages.CreateEvent;

public partial class CreateEventViewModelNew : BaseViewModel
{
    private const int ActiveEventStatus = 1;
    private readonly IEventTypeRestService eventTypeRestService;
    private readonly IMapRestService mapRestService;

    private readonly IMobEventManager mobEventManager;
    private readonly IWaiverManager waiverManager;
    private readonly IEventPartnerLocationServiceRestService eventPartnerLocationServiceRestService;

    private readonly INotificationService notificationService;
    private readonly IEventPartnerLocationServiceStatusRestService eventPartnerLocationServiceStatusRestService;

    public ICommand PreviousCommand { get; set; }
    public ICommand NextCommand { get; set; }

    public ICommand CloseCommand { get; set; }

    [ObservableProperty] private EventViewModel eventViewModel;

    [ObservableProperty] private string selectedEventType;

    [ObservableProperty] private AddressViewModel userLocation;

    [ObservableProperty] private bool isStepValid;

    [ObservableProperty] private bool canGoBack;

    [ObservableProperty] private bool arePartnersAvailable;

    [ObservableProperty] private bool areNoPartnersAvailable;

    private bool validating;

    private TimeSpan startTime;
    private TimeSpan endTime;

    public TimeSpan StartTime
    {
        get => startTime;
        set
        {
            if (startTime != value)
            {
                startTime = value;
                OnPropertyChanged();
                OnPropertyChanged(nameof(FormattedEventDuration));
            }
        }
    }

    public TimeSpan EndTime
    {
        get => endTime;
        set
        {
            if (endTime != value)
            {
                endTime = value;
                OnPropertyChanged();
                OnPropertyChanged(nameof(FormattedEventDuration));
            }
        }
    }

    public string FormattedEventDuration
    {
        get
        {
            if (EventViewModel != null)
            {
                var duration = EndTime - StartTime;
                return $"{duration.Hours} Hours and {duration.Minutes} Minutes";
            }

            return string.Empty;
        }
    }

    public CreateEventViewModelNew(IMobEventManager mobEventManager,
        IEventTypeRestService eventTypeRestService,
        IMapRestService mapRestService,
        IWaiverManager waiverManager,
        INotificationService notificationService,
        IEventPartnerLocationServiceRestService eventPartnerLocationServiceRestService)
        : base(notificationService)
    {
        this.mobEventManager = mobEventManager;
        this.eventTypeRestService = eventTypeRestService;
        this.mapRestService = mapRestService;
        this.waiverManager = waiverManager;
        this.notificationService = notificationService;
        this.eventPartnerLocationServiceRestService = eventPartnerLocationServiceRestService;

        NextCommand = new Command(async () =>
        {
            if (IsBusy)
                return;

            IsBusy = true;

            await Task.Delay(200);
            await SetCurrentStep(StepType.Forward);
            IsBusy = false;
        });

        PreviousCommand = new Command(async
            () =>
        {
            if (IsBusy)
                return;

            IsBusy = true;

            await Task.Delay(200);
            await SetCurrentStep(StepType.Backward);

            IsBusy = false;
        });

        CloseCommand = new Command(() => { Shell.Current.GoToAsync(".."); });
    }

    public string DefaultEventName { get; } = "New Event";

    public int CurrentStep { get; set; }

    [ObservableProperty] private IContentView currentView;

    public IContentView[] Steps { get; set; }

    public enum StepType
    {
        Forward,
        Backward
    }

    private void ValidateViewModel()
    {
        EventDurationError = string.Empty;
        DescriptionRequiredError = string.Empty;

        if ((EndTime - StartTime).TotalHours > 10)
        {
            EventDurationError = "Event maximum duration can only be 10 hours";
        }

        if ((EndTime - StartTime).TotalHours < 1)
        {
            EventDurationError = "Event minimum duration must be at least 1 hour";
        }

        if (string.IsNullOrEmpty(EventViewModel.Description))
        {
            DescriptionRequiredError = "Event description is required";
        }
    }

    private void ValidateCurrentStep(object sender, PropertyChangedEventArgs e)
    {
        if (EventViewModel == null)
            return;

        if (validating)
            return;

        validating = true;

        ValidateViewModel();

        switch (CurrentStep)
        {
            //Step 1 validation 
            case 0:
                if (!string.IsNullOrEmpty(EventViewModel.Name) &&
                    EventViewModel.EventDateOnly != default &&
                    !string.IsNullOrEmpty(SelectedEventType) && string.IsNullOrEmpty(EventDurationError) &&
                    !string.IsNullOrEmpty(EventViewModel.Description))
                {
                    IsStepValid = true;
                }
                else
                {
                    IsStepValid = false;
                }

                break;
            //Step 2 validation 
            case 1:
                if (!string.IsNullOrEmpty(EventViewModel.Address.City))
                {
                    IsStepValid = true;
                }
                else
                {
                    IsStepValid = false;
                }

                break;
            default:
                break;
        }

        validating = false;
    }

    private void SetCurrentView()
    {
        CurrentView = Steps[CurrentStep];

        NextStepText = CurrentStep != 3 ? "Next" : "Save Event";

        if (CurrentView is BaseStepClass current)
            current.OnNavigated();

        //TODO reference this colors from the app styles
        StepOneColor = CurrentStep == 0 ? Color.Parse("#005C4B") : Color.Parse("#CCDEDA");
        StepTwoColor = CurrentStep == 1 ? Color.Parse("#005C4B") : Color.Parse("#CCDEDA");
        StepThreeColor = CurrentStep == 2 ? Color.Parse("#005C4B") : Color.Parse("#CCDEDA");
        StepFourColor = CurrentStep == 3 ? Color.Parse("#005C4B") : Color.Parse("#CCDEDA");
        StepFiveColor = CurrentStep == 4 ? Color.Parse("#005C4B") : Color.Parse("#CCDEDA");
        StepSixColor = CurrentStep == 5 ? Color.Parse("#005C4B") : Color.Parse("#CCDEDA");
    }

    public async Task SetCurrentStep(StepType step)
    {
        if (step == StepType.Backward)
        {
            if (CurrentStep > 0)
            {
                CurrentStep--;
                SetCurrentView();
            }
        }
        else
        {
            if (CurrentStep < Steps.Length - 1)
            {
                CurrentStep++;

                if (CurrentStep == 5)
                {
                    await SaveEvent();
                }

                SetCurrentView();
            }
        }

        CanGoBack = CurrentStep != 0 && CurrentStep < 4;
    }

    // This is only for the map point
    public ObservableCollection<EventViewModel> Events { get; set; } = [];

    private List<EventType> EventTypes { get; set; } = [];
    private EventPartnerLocationViewModel selectedEventPartnerLocation;

    public ObservableCollection<string> ETypes { get; set; } = [];
    public ObservableCollection<EventPartnerLocationViewModel> AvailablePartners { get; set; } = new();
    public EventPartnerLocationViewModel SelectedEventPartnerLocation
    {
        get => selectedEventPartnerLocation;
        set
        {
            if (selectedEventPartnerLocation != value)
            {
                selectedEventPartnerLocation = value;
                OnPropertyChanged(nameof(selectedEventPartnerLocation));

                if (selectedEventPartnerLocation != null)
                {
                    PerformNavigation(selectedEventPartnerLocation);
                }
            }
        }
    }

    private async void PerformNavigation(EventPartnerLocationViewModel eventPartnerLocationViewModel)
    {
        await Shell.Current.GoToAsync(
            $"{nameof(EditEventPartnerLocationServicesPage)}?EventId={EventViewModel.Id}&PartnerLocationId={eventPartnerLocationViewModel.PartnerLocationId}");
    }

    public async Task Init()
    {
        IsBusy = true;

        SetCurrentView();

        foreach (var item in Steps)
        {
            if (item is BaseStepClass step)
                step.ViewModel = this;
        }

        try
        {
            if (!await waiverManager.HasUserSignedTrashMobWaiverAsync())
            {
                await Shell.Current.GoToAsync($"{nameof(WaiverPage)}");
            }

            UserLocation = App.CurrentUser.GetAddress();
            EventTypes = (await eventTypeRestService.GetEventTypesAsync()).ToList();

            // Set defaults
            EventViewModel = new EventViewModel
            {
                Name = DefaultEventName,
                EventDate = DateTime.Now.AddDays(1),
                IsEventPublic = true,
                MaxNumberOfParticipants = 0,
                DurationHours = 2,
                DurationMinutes = 0,
                Address = UserLocation,
                EventTypeId = EventTypes.OrderBy(e => e.DisplayOrder).First().Id,
                EventStatusId = ActiveEventStatus,
            };

            StartTime = TimeSpan.FromHours(9);

            EndTime = TimeSpan.FromHours(11);

            foreach (var eventType in EventTypes)
            {
                ETypes.Add(eventType.Name);
            }

            SelectedEventType = EventTypes.OrderBy(e => e.DisplayOrder).First().Name;

            Events.Add(EventViewModel);

            // We need to subscribe to both eventViewmodel and creatEventViewmodel propertyChanged to validate step
            eventViewModel.PropertyChanged += ValidateCurrentStep;
            PropertyChanged += ValidateCurrentStep;

            IsBusy = false;
        }
        catch (Exception ex)
        {
            SentrySdk.CaptureException(ex);
            IsBusy = false;
            await NotificationService.NotifyError(
                $"An error has occurred while loading the page. Please wait and try again in a moment.");
        }
    }

    [RelayCommand]
    private async Task SaveEvent()
    {
        IsBusy = true;

        try
        {
            if (!await Validate())
            {
                IsBusy = false;
                return;
            }

            if (!string.IsNullOrEmpty(SelectedEventType))
            {
                var eventType = EventTypes.FirstOrDefault(e => e.Name == SelectedEventType);
                if (eventType != null)
                {
                    EventViewModel.EventTypeId = eventType.Id;
                }
            }

            var mobEvent = EventViewModel.ToEvent();

            var updatedEvent = await mobEventManager.AddEventAsync(mobEvent);

            EventViewModel = updatedEvent.ToEventViewModel();
            Events.Clear();
            Events.Add(EventViewModel);

            await LoadPartners();
            
            await SetCurrentStep(StepType.Forward);

            IsBusy = false;

            await notificationService.Notify("Event has been saved.");
        }
        catch (Exception ex)
        {
            SentrySdk.CaptureException(ex);
            IsBusy = false;
            await NotificationService.NotifyError(
                $"An error has occurred while saving the event. Please wait and try again in a moment.");
        }
    }

    private async Task LoadPartners()
    {
        ArePartnersAvailable = false;
        AreNoPartnersAvailable = true;

        var eventPartnerLocations = await eventPartnerLocationServiceRestService.GetEventPartnerLocationsAsync(EventViewModel.Id);

        AvailablePartners.Clear();

        foreach (var eventPartnerLocation in eventPartnerLocations)
        {
            var eventPartnerLocationViewModel = new EventPartnerLocationViewModel
            {
                PartnerLocationId = eventPartnerLocation.PartnerLocationId,
                PartnerLocationName = eventPartnerLocation.PartnerLocationName,
                PartnerLocationNotes = eventPartnerLocation.PartnerLocationNotes,
                PartnerServicesEngaged = eventPartnerLocation.PartnerServicesEngaged,
                PartnerId = eventPartnerLocation.PartnerId,
            };

            AvailablePartners.Add(eventPartnerLocationViewModel);
        }

        ArePartnersAvailable = AvailablePartners.Any();
        AreNoPartnersAvailable = !ArePartnersAvailable;
    }

    public async Task ChangeLocation(Location location)
    {
        var addr = await mapRestService.GetAddressAsync(location.Latitude, location.Longitude);

        EventViewModel.Address.City = addr.City;
        EventViewModel.Address.Country = addr.Country;
        EventViewModel.Address.Latitude = location.Latitude;
        EventViewModel.Address.Longitude = location.Longitude;
        EventViewModel.Address.Location = location;
        EventViewModel.Address.PostalCode = addr.PostalCode;
        EventViewModel.Address.Region = addr.Region;
        EventViewModel.Address.StreetAddress = addr.StreetAddress;

        Events.Clear();
        Events.Add(EventViewModel);

        ValidateCurrentStep(null, null);
    }

    private async Task<bool> Validate()
    {
        if (EventViewModel.IsEventPublic && EventViewModel.EventDate < DateTimeOffset.Now)
        {
            await NotificationService.NotifyError("Event Dates for new public events must be in the future.");
            return false;
        }

        return true;
    }

    #region UI Related properties

    [ObservableProperty] private string nextStepText = "Next";

    //Event current step control

    [ObservableProperty] private Color stepOneColor;

    [ObservableProperty] private Color stepTwoColor;

    [ObservableProperty] private Color stepThreeColor;

    [ObservableProperty] private Color stepFourColor;

    [ObservableProperty] private Color stepFiveColor;

    [ObservableProperty] private Color stepSixColor;

    //Validation Errors

    [ObservableProperty] private string eventDurationError;
    
    [ObservableProperty] private string descriptionRequiredError;

    #endregion
}