﻿using CommunityToolkit.Mvvm.ComponentModel;
using System.Diagnostics;
using TrashMobMobileApp.Authentication;
using TrashMobMobileApp.Services;

namespace TrashMobMobileApp.ViewModels;

public partial class MainViewModel : ObservableObject
{
    private readonly IAuthService _authService;
    private readonly IUserService _userService;

    public MainViewModel(IAuthService authService, IUserService userService)
    {
        _authService = authService;
        _userService = userService;
    }

    [ObservableProperty]
    private string? welcomeMessage;

    [ObservableProperty]
    private bool isBusy = false;

    public async Task Init()
    {
        IsBusy = true;
        
        var signedIn = await _authService.SignInSilentAsync(false);

        if (signedIn.Succeeded)
        {
            var email = _authService.GetUserEmail();
            var user = await _userService.GetUserByEmailAsync(email);
            WelcomeMessage = $"Welcome, {user.UserName}!";
            
            IsBusy = false;
        }
        else
        {
            try
            {
                await Shell.Current.GoToAsync($"{nameof(WelcomePage)}");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error: {ex.Message}");
            }
        }
    }
}
