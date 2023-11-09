﻿namespace TrashMob.Controllers.IFTTT
{
    using System.Collections.Generic;

    public class IftttTrigger
    {
        public Dictionary<string, string> new_event_created { get; set; }

        public IftttTrigger()
        {
            new_event_created = new Dictionary<string, string>()
                {
                    { "city", "" },
                    { "region", "Washington" },
                    { "country", "United States" },
                    { "postal_code", "" }
                };
        }
    }
}
