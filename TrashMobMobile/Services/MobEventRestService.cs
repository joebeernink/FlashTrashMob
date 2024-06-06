﻿namespace TrashMobMobile.Data;

using System.Diagnostics;
using System.Globalization;
using System.Net.Http.Json;
using Newtonsoft.Json;
using TrashMob.Models;
using TrashMob.Models.Poco;
using TrashMobMobile.Models;

public class MobEventRestService : RestServiceBase, IMobEventRestService
{
    protected override string Controller => "events";

    public async Task<IEnumerable<Event>> GetActiveEventsAsync(CancellationToken cancellationToken = default)
    {
        var mobEvents = new List<Event>();

        try
        {
            var requestUri = $"{Controller}/active";
            var response = await AnonymousHttpClient.GetAsync(requestUri, cancellationToken);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            mobEvents = JsonConvert.DeserializeObject<List<Event>>(content);
        }
        catch (Exception ex)
        {
            Debug.WriteLine(@"\tERROR {0}", ex.Message);
            throw;
        }

        return mobEvents;
    }

    public async Task<IEnumerable<Event>> GetCompletedEventsAsync(CancellationToken cancellationToken = default)
    {
        var mobEvents = new List<Event>();

        try
        {
            var requestUri = $"{Controller}/completed";
            var response = await AnonymousHttpClient.GetAsync(requestUri, cancellationToken);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            mobEvents = JsonConvert.DeserializeObject<List<Event>>(content);
        }
        catch (Exception ex)
        {
            Debug.WriteLine(@"\tERROR {0}", ex.Message);
            throw;
        }

        return mobEvents;
    }

    public async Task<IEnumerable<Event>> GetAllEventsAsync(CancellationToken cancellationToken = default)
    {
        var mobEvents = new List<Event>();

        try
        {
            var requestUri = $"{Controller}";
            var response = await AnonymousHttpClient.GetAsync(requestUri, cancellationToken);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            mobEvents = JsonConvert.DeserializeObject<List<Event>>(content);
        }
        catch (Exception ex)
        {
            Debug.WriteLine(@"\tERROR {0}", ex.Message);
            throw;
        }

        return mobEvents;
    }

    public async Task<IEnumerable<Event>> GetUserEventsAsync(Guid userId, bool showFutureEventsOnly,
        CancellationToken cancellationToken = default)
    {
        var mobEvents = new List<Event>();

        try
        {
            var requestUri = $"{Controller}/userevents/{userId}/{showFutureEventsOnly}";
            var response = await AuthorizedHttpClient.GetAsync(requestUri, cancellationToken);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            mobEvents = JsonConvert.DeserializeObject<List<Event>>(content);
        }
        catch (Exception ex)
        {
            Debug.WriteLine(@"\tERROR {0}", ex.Message);
        }

        return mobEvents;
    }

    public async Task<Event> GetEventAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        try
        {
            var requestUri = Controller + "/" + eventId;
            var response = await AuthorizedHttpClient.GetAsync(requestUri, cancellationToken);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            return JsonConvert.DeserializeObject<Event>(content);
        }
        catch (Exception ex)
        {
            Debug.WriteLine(@"\tERROR {0}", ex.Message);
            throw;
        }
    }

    public async Task<Event> UpdateEventAsync(Event mobEvent, CancellationToken cancellationToken = default)
    {
        try
        {
            var content = JsonContent.Create(mobEvent, typeof(Event), null, SerializerOptions);
            var response = await AuthorizedHttpClient.PutAsync(Controller, content, cancellationToken);
            response.EnsureSuccessStatusCode();
            var returnContent = await response.Content.ReadAsStringAsync(cancellationToken);
            return JsonConvert.DeserializeObject<Event>(returnContent);
        }
        catch (Exception ex)
        {
            Debug.WriteLine(@"\tERROR {0}", ex.Message);
            throw;
        }
    }

    public async Task<Event> AddEventAsync(Event mobEvent, CancellationToken cancellationToken = default)
    {
        HttpResponseMessage response = null;

        try
        {
            var content = JsonContent.Create(mobEvent, typeof(Event), null, SerializerOptions);
            response = await AuthorizedHttpClient.PostAsync(Controller, content, cancellationToken);
            response.EnsureSuccessStatusCode();
            var returnContent = await response.Content.ReadAsStringAsync(cancellationToken);
            return JsonConvert.DeserializeObject<Event>(returnContent);
        }
        catch (Exception ex)
        {
            Debug.WriteLine(@"\tERROR {0}", ex.Message);
            throw;
        }
    }

    public async Task DeleteEventAsync(EventCancellationRequest cancelEvent,
        CancellationToken cancellationToken = default)
    {
        HttpResponseMessage response = null;

        try
        {
            var content = JsonContent.Create(cancelEvent, typeof(EventCancellationRequest), null, SerializerOptions);
            var httpRequestMessage = new HttpRequestMessage
            {
                Method = HttpMethod.Delete,
                Content = content,
                RequestUri = AuthorizedHttpClient.BaseAddress,
            };

            response = await AuthorizedHttpClient.SendAsync(httpRequestMessage, cancellationToken);
            response.EnsureSuccessStatusCode();
        }
        catch (Exception ex)
        {
            Debug.WriteLine(@"\tERROR {0}", ex.Message);
            throw;
        }
    }

    public async Task<IEnumerable<Event>> GetEventsUserIsAttending(Guid userId,
        CancellationToken cancellationToken = default)
    {
        var mobEvents = new List<Event>();

        try
        {
            var requestUri = Controller + $"/eventsuserisattending/{userId}";
            var response = await AuthorizedHttpClient.GetAsync(requestUri, cancellationToken);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            mobEvents = JsonConvert.DeserializeObject<List<Event>>(content);
        }
        catch (Exception ex)
        {
            Debug.WriteLine(@"\tERROR {0}", ex.Message);
            throw;
        }

        return mobEvents;
    }

    public async Task<IEnumerable<Location>> GetLocationsByTimeRangeAsync(DateTimeOffset startDate,
        DateTimeOffset endDate, CancellationToken cancellationToken = default)
    {
        var startDateTime = startDate.ToString();
        var endDateTime = endDate.ToString();

        // Convert the DateTime string into the correct Format if the Culture is not Invariant
        if (CultureInfo.CurrentCulture != CultureInfo.InvariantCulture)
        {
            startDateTime = startDate.ToString(@"yyyy/MM/dd hh:mm:ss tt", new CultureInfo("en-US"));
            endDateTime = endDate.ToString(@"yyyy/MM/dd hh:mm:ss tt", new CultureInfo("en-US"));
        }

        var requestUri = Controller + "/locationsbytimerange?startTime=" + startDateTime + "&endTime=" + endDateTime;

        using (var response = await AnonymousHttpClient.GetAsync(requestUri, cancellationToken))
        {
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync(cancellationToken);

            if (string.IsNullOrEmpty(content))
            {
                return [];
            }

            return JsonConvert.DeserializeObject<IEnumerable<Location>>(content);
        }
    }
}