﻿#nullable disable

namespace TrashMob.Shared.Models
{
    public partial class Community : ExtendedBaseModel
    {
        public Community()
        {
        }

        public string City { get; set; }

        public string Region { get; set; }

        public string Country { get; set; }

        public string PostalCode { get; set; }

        public double? Latitude { get; set; }

        public double? Longitude { get; set; }

        public int CommunityStatusId { get; set; }

        public virtual CommunityStatus CommunityStatus { get; set; }
    }
}
