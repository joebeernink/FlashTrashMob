﻿namespace TrashMobMobile.ViewModels;

using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using TrashMob.Models;
using TrashMobMobile.Extensions;
using TrashMobMobile.Services;

public partial class CreatePickupLocationViewModel(IPickupLocationManager pickupLocationManager,
                                                   IMapRestService mapRestService,
                                                   IMobEventManager mobEventManager,
                                                   INotificationService notificationService,
                                                   IUserManager userManager) 
    : BaseViewModel(notificationService)
{
    private readonly IMapRestService mapRestService = mapRestService;
    private readonly IMobEventManager mobEventManager = mobEventManager;
    private readonly IUserManager userManager = userManager;
    private readonly IPickupLocationManager pickupLocationManager = pickupLocationManager;

    [ObservableProperty]
    private EventViewModel eventViewModel = new();

    [ObservableProperty]
    private PickupLocationViewModel pickupLocationViewModel = new(pickupLocationManager, mobEventManager, notificationService, userManager);

    // This is only for the map point
    public ObservableCollection<PickupLocationViewModel> PickupLocations { get; set; } = [];

    public string LocalFilePath { get; set; } = string.Empty;

    public async Task Init(Guid eventId)
    {
        IsBusy = true;

        try
        {
            var mobEvent = await mobEventManager.GetEventAsync(eventId);

            EventViewModel = mobEvent.ToEventViewModel(userManager.CurrentUser.Id);

            PickupLocationViewModel = new PickupLocationViewModel(pickupLocationManager, mobEventManager, NotificationService, userManager)
            {
                Name = "Pickup",
                Address = new AddressViewModel(),
                Navigation = Navigation,
            };

            await PickupLocationViewModel.Init(eventId);

            IsBusy = false;
        }
        catch (Exception ex)
        {
            SentrySdk.CaptureException(ex);
            IsBusy = false;
            await NotificationService.NotifyError($"An error has occurred while loading the event. Please wait and try again in a moment.");
        }
    }

    public async Task UpdateLocation()
    {
        var location = await GetCurrentLocation();

        if (location != null)
        {
            var address = await mapRestService.GetAddressAsync(location.Latitude, location.Longitude);
            PickupLocationViewModel.Address.Longitude = location.Longitude;
            PickupLocationViewModel.Address.Latitude = location.Latitude;
            PickupLocationViewModel.Address.City = address.City;
            PickupLocationViewModel.Address.Country = address.Country;
            PickupLocationViewModel.Address.County = address.County;
            PickupLocationViewModel.Address.PostalCode = address.PostalCode;
            PickupLocationViewModel.Address.Region = address.Region;
            PickupLocationViewModel.Address.StreetAddress = address.StreetAddress;
            PickupLocationViewModel.Address.Location = new Location(PickupLocationViewModel.Address.Latitude.Value,
                PickupLocationViewModel.Address.Longitude.Value);

            PickupLocations.Clear();
            PickupLocations.Add(PickupLocationViewModel);
        }
        else
        {
            await NotificationService.NotifyError("Could not get location for image");
        }
    }

    public static async Task<Location?> GetCurrentLocation()
    {
        try
        {
            var request = new GeolocationRequest(GeolocationAccuracy.Best, TimeSpan.FromSeconds(10));

            var cancelTokenSource = new CancellationTokenSource();

            return await Geolocation.Default.GetLocationAsync(request, cancelTokenSource.Token);
        }
        //catch (FeatureNotSupportedException fnsEx)
        //{
        //    // Handle not supported on device exception
        //}
        //catch (FeatureNotEnabledException fneEx)
        //{
        //    // Handle not enabled on device exception
        //}
        //catch (PermissionException pEx)
        //{
        //    // Handle permission exception
        //}
        catch (Exception ex)
        {
            SentrySdk.CaptureException(ex);
            // Unable to get location
        }

        return null;
    }

    [RelayCommand]
    private async Task SavePickupLocation()
    {
        IsBusy = true;

        try
        {
            var pickupLocation = new PickupLocation
            {
                City = PickupLocationViewModel.Address.City,
                Country = PickupLocationViewModel.Address.Country,
                EventId = EventViewModel.Id,
                HasBeenPickedUp = false,
                HasBeenSubmitted = false,
                Latitude = PickupLocationViewModel.Address.Latitude,
                Longitude = PickupLocationViewModel.Address.Longitude,
                Notes = PickupLocationViewModel.Notes,
                Name = PickupLocationViewModel.Name,
                PostalCode = PickupLocationViewModel.Address.PostalCode,
                Region = PickupLocationViewModel.Address.Region,
                StreetAddress = PickupLocationViewModel.Address.StreetAddress,
                County = PickupLocationViewModel.Address.County,
            };

            var updatedPickupLocation = await pickupLocationManager.AddPickupLocationAsync(pickupLocation);
            await pickupLocationManager.AddPickupLocationImageAsync(updatedPickupLocation.EventId, updatedPickupLocation.Id,
                LocalFilePath);

            IsBusy = false;

            await NotificationService.Notify("Pickup Location has been saved.");
            await Navigation.PopAsync();
        }
        catch (Exception ex)
        {
            SentrySdk.CaptureException(ex);
            IsBusy = false;
            await NotificationService.NotifyError($"An error has occurred while saving the pickup location. Please wait and try again in a moment.");
        }
    }
}