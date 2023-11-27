﻿namespace TrashMobMobileApp.ViewModels;

using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using TrashMobMobileApp.Authentication;
using TrashMobMobileApp.Data;

public partial class WelcomeViewModel : BaseViewModel
{
    private readonly IAuthService authService;
    private readonly IStatsRestService statsRestService;

    public WelcomeViewModel(IAuthService authService, IStatsRestService statsRestService)
    {
        this.authService = authService;
        this.statsRestService = statsRestService;        
    }

    [ObservableProperty]
    StatisticsViewModel statisticsViewModel = new StatisticsViewModel();

    public async Task Init()
    {
        var stats = await statsRestService.GetStatsAsync();

        StatisticsViewModel.TotalAttendees = stats.TotalParticipants;
        StatisticsViewModel.TotalBags = stats.TotalBags;
        StatisticsViewModel.TotalEvents = stats.TotalEvents;
        StatisticsViewModel.TotalHours = stats.TotalHours;        
    }

    [RelayCommand]
    private async Task SignIn()
    {
        IsBusy = true;

        var signedIn = await authService.SignInAsync();

        IsBusy = false;

        if (signedIn.Succeeded)
        {
            await Shell.Current.GoToAsync($"//{nameof(MainPage)}");
        }
        else
        {
            IsError = true;
        }
    }
}
