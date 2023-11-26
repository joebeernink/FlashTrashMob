﻿namespace TrashMobMobileApp.ViewModels;

using CommunityToolkit.Mvvm.ComponentModel;

public partial class EventSummaryViewModel : BaseViewModel
{
    public EventSummaryViewModel()
    {
    }

    [ObservableProperty]
    Guid eventId;

    [ObservableProperty]
    int numberOfBuckets;

    [ObservableProperty]
    int numberOfBags;

    [ObservableProperty]
    int durationInMinutes;

    [ObservableProperty]
    int actualNumberOfAttendees;

    [ObservableProperty]
    string notes;
}
