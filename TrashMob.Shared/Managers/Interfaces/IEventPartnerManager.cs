﻿namespace TrashMob.Shared.Managers.Interfaces
{
    using System;
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;
    using TrashMob.Models;

    public interface IEventPartnerManager : IBaseManager<EventPartner>
    {
        Task<IEnumerable<EventPartner>> GetCurrentPartners(Guid eventId, CancellationToken cancellationToken);
        
        Task<IEnumerable<PartnerLocation>> GetPotentialPartnerLocations(Guid eventId, CancellationToken cancellationToken);
    }
}