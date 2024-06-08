﻿namespace TrashMobMobile.Data;

using System.Diagnostics;
using System.Net.Http.Json;
using Newtonsoft.Json;
using TrashMob.Models;
using TrashMob.Models.Poco;
using TrashMobMobile.Services;

public class EventPartnerLocationServiceRestService(IHttpClientFactory httpClientFactory) : RestServiceBase(httpClientFactory), IEventPartnerLocationServiceRestService
{
    protected override string Controller => "eventpartnerlocationservices";

    public async Task<PartnerLocation> GetHaulingPartnerLocationAsync(Guid eventId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var requestUri = Controller + "/gethaulingpartnerlocation/" + eventId;

            using (var response = await AuthorizedHttpClient.GetAsync(requestUri, cancellationToken))
            {
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync(cancellationToken);
                var result = JsonConvert.DeserializeObject<PartnerLocation>(content);
                return result;
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine(@"\tERROR {0}", ex.Message);
            throw;
        }
    }

    public async Task<IEnumerable<DisplayEventPartnerLocation>> GetEventPartnerLocationsAsync(Guid eventId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var requestUri = Controller + "/" + eventId;

            using (var response = await AuthorizedHttpClient.GetAsync(requestUri, cancellationToken))
            {
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync(cancellationToken);
                var result = JsonConvert.DeserializeObject<List<DisplayEventPartnerLocation>>(content);
                return result;
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine(@"\tERROR {0}", ex.Message);
            throw;
        }
    }

    public async Task<IEnumerable<DisplayEventPartnerLocationService>> GetEventPartnerLocationServicesAsync(
        Guid eventId, Guid partnerId, CancellationToken cancellationToken = default)
    {
        try
        {
            var requestUri = Controller + "/" + eventId + "/" + partnerId;

            using (var response = await AuthorizedHttpClient.GetAsync(requestUri, cancellationToken))
            {
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync(cancellationToken);
                var result = JsonConvert.DeserializeObject<List<DisplayEventPartnerLocationService>>(content);
                return result;
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine(@"\tERROR {0}", ex.Message);
            throw;
        }
    }

    public async Task<EventPartnerLocationService> UpdateEventPartnerLocationService(
        EventPartnerLocationService eventPartnerLocationService, CancellationToken cancellationToken = default)
    {
        try
        {
            var content = JsonContent.Create(eventPartnerLocationService, typeof(EventPartnerLocationService), null,
                SerializerOptions);
            var response = await AuthorizedHttpClient.PutAsync(Controller, content, cancellationToken);
            response.EnsureSuccessStatusCode();
            var returnContent = await response.Content.ReadAsStringAsync(cancellationToken);
            return JsonConvert.DeserializeObject<EventPartnerLocationService>(returnContent);
        }
        catch (Exception ex)
        {
            Debug.WriteLine(@"\tERROR {0}", ex.Message);
            throw;
        }
    }

    public async Task<EventPartnerLocationService> AddEventPartnerLocationService(
        EventPartnerLocationService eventPartnerLocationService, CancellationToken cancellationToken = default)
    {
        try
        {
            var content = JsonContent.Create(eventPartnerLocationService, typeof(EventPartnerLocationService), null,
                SerializerOptions);
            var response = await AuthorizedHttpClient.PostAsync(Controller, content, cancellationToken);
            response.EnsureSuccessStatusCode();
            var returnContent = await response.Content.ReadAsStringAsync(cancellationToken);
            return JsonConvert.DeserializeObject<EventPartnerLocationService>(returnContent);
        }
        catch (Exception ex)
        {
            Debug.WriteLine(@"\tERROR {0}", ex.Message);
            throw;
        }
    }

    public async Task DeleteEventPartnerLocationServiceAsync(EventPartnerLocationService eventPartnerLocationService,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var requestUri = string.Concat(Controller,
                $"/{eventPartnerLocationService.EventId}/{eventPartnerLocationService.PartnerLocationId}/{eventPartnerLocationService.ServiceTypeId}");

            using (var response = await AuthorizedHttpClient.DeleteAsync(requestUri, cancellationToken))
            {
                response.EnsureSuccessStatusCode();
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine(@"\tERROR {0}", ex.Message);
            throw;
        }
    }
}