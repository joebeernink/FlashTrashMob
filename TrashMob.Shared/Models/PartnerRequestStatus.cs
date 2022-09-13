﻿#nullable disable

namespace TrashMob.Shared.Models
{
    using System.Collections.Generic;

    public partial class PartnerRequestStatus : LookupModel
    {
        public PartnerRequestStatus()
        {
            PartnerRequests = new HashSet<PartnerRequest>();
        }

        public virtual ICollection<PartnerRequest> PartnerRequests { get; set; }
    }
}
