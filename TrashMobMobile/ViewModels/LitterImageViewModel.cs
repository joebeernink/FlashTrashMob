﻿namespace TrashMobMobile.ViewModels;

using CommunityToolkit.Mvvm.ComponentModel;

public partial class LitterImageViewModel : BaseViewModel
{
    public LitterImageViewModel()
    {
        AzureBlobUrl = string.Empty;
        Address = new AddressViewModel();
    }

    [ObservableProperty]
    Guid litterReportId;

    [ObservableProperty]
    Guid id;

    [ObservableProperty]
    string azureBlobUrl;

    [ObservableProperty]
    AddressViewModel address;

    [ObservableProperty]
    bool isCancelled;
}
