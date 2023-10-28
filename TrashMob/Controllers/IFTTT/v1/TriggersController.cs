﻿namespace TrashMob.Controllers.IFTTT
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System.Threading;
    using System.Threading.Tasks;
    using TrashMob.Security;
    using TrashMob.Shared.Poco.IFTTT;
    using TrashMob.Shared.Managers.Interfaces;
    using Microsoft.Identity.Web.Resource;
    using TrashMob.Shared;

    [Route("api/ifttt/v1/[controller]")]
    [RequiredScope(Constants.TrashMobIFTTTScope)]
    [ApiController]
    public class TriggersController : SecureController
    {
        private readonly ITriggersManager triggersManager;

        public TriggersController(ITriggersManager triggersManager) 
        {
            this.triggersManager = triggersManager;
        }

        [HttpPost("new_event_created")]
        [Authorize(Policy = AuthorizationPolicyConstants.ValidUser)]
        [Authorize(Policy = AuthorizationPolicyConstants.IftttServiceKey)]
        public async Task<ActionResult> Get(TriggersRequest triggersRequest, CancellationToken cancellationToken)
        {
            var events = await triggersManager.GetEventsTriggerDataAsync(triggersRequest, UserId, cancellationToken);

            var response = new DataResponse()
            {
                Data = events,
            };

            return Ok(response);
        }
    }
}
