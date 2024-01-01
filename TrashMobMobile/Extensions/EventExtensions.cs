﻿namespace TrashMobMobile.Extensions
{
    using TrashMob.Models;

    public static class EventExtensions
    {
        public static string GetFormattedAddress(this Event mobEvent)
        {
            if (string.IsNullOrEmpty(mobEvent.StreetAddress) && string.IsNullOrEmpty(mobEvent.City)
                && string.IsNullOrEmpty(mobEvent.Country) && string.IsNullOrEmpty(mobEvent.PostalCode) && string.IsNullOrEmpty(mobEvent.Region))
            {
                return string.Empty;
            }

            return string.Concat(mobEvent.StreetAddress, ", ", mobEvent.City, ", ", mobEvent.Region, ", ", mobEvent.PostalCode, ", ", mobEvent.Country);
        }

        public static string GetFormattedDuration(this Event mobEvent)
        {
            //TODO: move hard code string to resource file
            return string.Concat(mobEvent.DurationHours, " hour ", mobEvent.DurationMinutes, " minutes");
        }

        public static string GetFormattedLocalDate(this DateTimeOffset dateTime)
        {
            var localDateTime = TimeZoneInfo.ConvertTime(dateTime, TimeZoneInfo.Local).DateTime;
            return String.Format("{0:dddd, MMMM d, yyyy}", localDateTime);
        }

        public static string GetFormattedLocalTime(this DateTimeOffset dateTime)
        {
            var localDateTime = TimeZoneInfo.ConvertTime(dateTime, TimeZoneInfo.Local).DateTime;
            return localDateTime.ToShortTimeString();
        }

        public static string GetPublicEventText(this Event mobEvent)
        {
            //TODO: move hard code string to resource file
            return mobEvent.IsEventPublic ? "Yes" : "No";
        }

        public static string GetEventStatusText(this Event mobEvent)
        {
            //TODO: move hard code string to resource file
            if (mobEvent.EventStatusId == 1)
            {
                return "Active";
            }
            else if (mobEvent.EventStatusId == 2)
            {
                return "Full";
            }
            else if (mobEvent.EventStatusId == 3)
            {
                return "Cancelled";
            }
            else if (mobEvent.EventStatusId == 4)
            {
                return "Complete";
            }

            return "N/A";
        }

        public static bool IsEventLead(this Event mobEvent)
        {
            var userId = App.CurrentUser.Id;

            return mobEvent.CreatedByUserId == userId;
        }

        public static bool IsCompleted(this Event mobEvent)
        {
            return mobEvent.EventDate.ToUniversalTime() < DateTimeOffset.UtcNow;
        }

        public static bool IsCancellable(this Event mobEvent)
        {
            return mobEvent.EventDate.ToUniversalTime() > DateTimeOffset.UtcNow;
        }

        public static bool AreNewRegistrationsAllowed(this Event mobEvent)
        {
            return mobEvent.EventDate.ToUniversalTime() > DateTimeOffset.UtcNow;
        }

        public static bool AreUnregistrationsAllowed(this Event mobEvent)
        {
            return mobEvent.EventDate.ToUniversalTime() > DateTimeOffset.UtcNow;
        }

        public static EventViewModel ToEventViewModel(this Event mobEvent)
        {
            var eventViewModel = new EventViewModel()
            {
                Address = mobEvent.ToAddressViewModel(),
                Id = mobEvent.Id,
                CancellationReason = mobEvent.CancellationReason,
                Description = mobEvent.Description,
                DurationHours = mobEvent.DurationHours,
                DurationMinutes = mobEvent.DurationMinutes,
                EventDate = mobEvent.EventDate,
                EventStatusId = mobEvent.EventStatusId,
                EventTypeId = mobEvent.EventTypeId,
                IsEventPublic = mobEvent.IsEventPublic,
                MaxNumberOfParticipants = mobEvent.MaxNumberOfParticipants,
                Name = mobEvent.Name,
                UserRoleForEvent = mobEvent.IsEventLead() ? "Lead" : "Attendee"
            };

            return eventViewModel;
        }

        internal static AddressViewModel ToAddressViewModel(this Event mobEvent)
        {
            return new AddressViewModel
            {
                City = mobEvent.City,
                Country = mobEvent.Country,
                Latitude = mobEvent.Latitude,
                Longitude = mobEvent.Longitude,
                PostalCode = mobEvent.PostalCode,
                Region = mobEvent.Region,
                StreetAddress = mobEvent.StreetAddress,
                Location = new Location(mobEvent.Latitude.Value, mobEvent.Longitude.Value)
            };
        }
    }
}
