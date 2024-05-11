﻿namespace TrashMobMobile.ViewModels;

using CommunityToolkit.Mvvm.ComponentModel;
using System.Windows.Input;
using TrashMob.Models;
using TrashMobMobile.Data;

public partial class ContactUsViewModel : BaseViewModel
{
    private readonly IContactRequestManager contactRequestManager;

    public ContactUsViewModel(IContactRequestManager contactRequestManager)
    {
        SubmitMessageCommand = new Command(async () => await SubmitMessage());
        this.contactRequestManager = contactRequestManager;
    }

    [ObservableProperty]
    string name;

    [ObservableProperty]
    string email;

    [ObservableProperty]
    string message;

    [ObservableProperty]
    string confirmation;

    [ObservableProperty]
    double overlayOpacity;

    public ICommand SubmitMessageCommand { get; set; }

    private async Task SubmitMessage()
    {
        IsBusy = true;
        OverlayOpacity = 0.25; // Workaround for: https://github.com/dotnet/maui/issues/18234

        var contactRequest = new ContactRequest
        {
            Name = Name,
            Email = Email,
            Message = Message
        };

        await contactRequestManager.AddContactRequestAsync(contactRequest);

        IsBusy = false;

        await Notify("Message sent successfully!");

        await Navigation.PopToRootAsync();
    }
}
