﻿namespace TrashMobMobileApp.Data
{
    using Microsoft.Extensions.Options;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Threading.Tasks;
    using TrashMob.Models;
    using TrashMobMobileApp.Config;

    public class EventPartnerLocationServiceStatusRestService : RestServiceBase, IEventPartnerLocationServiceStatusRestService
    {
        protected override string Controller => "eventpartnerlocationservicestatuses";

        public EventPartnerLocationServiceStatusRestService(IOptions<Settings> settings)
            : base(settings)
        {
        }

        public async Task<IEnumerable<EventPartnerLocationServiceStatus>> GetEventPartnerLocationServiceStatusesAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                using (var response = await AnonymousHttpClient.GetAsync(Controller, cancellationToken))
                {
                    response.EnsureSuccessStatusCode();
                    string responseString = await response.Content.ReadAsStringAsync(cancellationToken);

                    return JsonConvert.DeserializeObject<List<EventPartnerLocationServiceStatus>>(responseString);
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(@"\tERROR {0}", ex.Message);
                throw;
            }
        }
    }
}