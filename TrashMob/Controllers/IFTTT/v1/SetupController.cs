﻿namespace TrashMob.Controllers.IFTTT
{
    using Microsoft.AspNetCore.Mvc;
    
    [Route("api/ifttt/v1/test/[controller]")]
    [ApiController]

    public class SetupController : Controller
    {
        [HttpPost]
        public ActionResult GetInfo()
        {
            var dataResponse = new DataResponse();

            var accessToken = string.IsNullOrWhiteSpace(HttpContext.Request.Headers.Authorization.ToString()) ? "XXXX" : HttpContext.Request.Headers.Authorization.ToString();

            var sampleResponse = new SampleResponse
            {
                accessToken = accessToken,
                samples = new System.Collections.Generic.List<Sample>()
            };

            sampleResponse.samples.Add(new Sample());

            dataResponse.Data = sampleResponse;

            return Ok(dataResponse);
        }
    }
}
