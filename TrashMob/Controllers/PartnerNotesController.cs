﻿namespace TrashMob.Controllers
{
    using Microsoft.ApplicationInsights;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using TrashMob.Shared.Managers.Interfaces;
    using TrashMob.Shared.Models;
    using TrashMob.Shared.Persistence.Interfaces;

    [Authorize]
    [Route("api/partnernotes")]
    public class PartnerNotesController : BaseController
    {
        private readonly IBaseManager<PartnerNote> manager;
        private readonly IUserRepository userRepository;

        public PartnerNotesController(IBaseManager<PartnerNote> manager, 
                                             IUserRepository userRepository,
                                             TelemetryClient telemetryClient)
            : base(telemetryClient)
        {
            this.manager = manager;
            this.userRepository = userRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddCommunityNote(PartnerNote partnerNote)
        {
            var currentUser = await GetUser(userRepository);

            if (currentUser == null)
            {
                return Forbid();
            }

            await manager.Add(partnerNote, currentUser.Id).ConfigureAwait(false);
            TelemetryClient.TrackEvent(nameof(AddCommunityNote));

            return Ok();
        }
    }
}
