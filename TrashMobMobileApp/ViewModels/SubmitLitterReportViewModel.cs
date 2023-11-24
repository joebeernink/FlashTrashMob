﻿namespace TrashMobMobileApp.ViewModels;

using CommunityToolkit.Mvvm.ComponentModel;

public partial class SubmitLitterReportViewModel : ObservableObject
{
    public SubmitLitterReportViewModel()
    {
    }

    public LitterReportViewModel LitterReportViewModel { get; set; }

    [ObservableProperty]
    bool isBusy = false;

    [ObservableProperty]
    bool isError = false;
}
