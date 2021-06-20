﻿
namespace TrashMob.Shared.Engine
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using TrashMob.Shared.Models;
    using TrashMob.Shared.Persistence;

    public class UpcomingEventsInYourAreaTodayNotifier : NotificationEngineBase, INotificationEngine
    {
        protected override NotificationTypeEnum NotificationType => NotificationTypeEnum.UpcomingEventsInYourAreaToday;

        protected override string EmailSubject => "Upcoming TrashMob.eco events in your area today!";

        public UpcomingEventsInYourAreaTodayNotifier(IEventRepository eventRepository, 
                                                     IUserRepository userRepository, 
                                                     IEventAttendeeRepository eventAttendeeRepository, 
                                                     IUserNotificationRepository userNotificationRepository,
                                                     IUserNotificationPreferenceRepository userNotificationPreferenceRepository,
                                                     IEmailSender emailSender) : 
            base(eventRepository, userRepository, eventAttendeeRepository, userNotificationRepository, userNotificationPreferenceRepository, emailSender)
        {
        }

        public async Task GenerateNotificationsAsync(CancellationToken cancellationToken = default)
        {
            // Get list of users who have notifications turned on for locations
            var users = await UserRepository.GetAllUsers().ConfigureAwait(false);

            // for each user
            foreach (var user in users)
            {
                if (await IsOptedOut(user).ConfigureAwait(false))
                {
                    continue;
                }

                var eventsToNotifyUserFor = new List<Event>();

                // Get list of events where date is today and either city or postal code matches user
                var events = await EventRepository.GetActiveEvents().ConfigureAwait(false);

                // Get list of events user is already attending
                var eventsUserIsAttending = await EventAttendeeRepository.GetEventsUserIsAttending(user.Id).ConfigureAwait(false);

                foreach (var mobEvent in events)
                {
                    // Verify that the user is not already attending the event. No need to remind them to attend
                    if (eventsUserIsAttending.Any(ea => ea.Id == mobEvent.Id))
                    {
                        continue;
                    }

                    // Get list of notification events user has already received for the event
                    var notifications = await UserNotificationRepository.GetUserNotifications(user.Id, mobEvent.Id).ConfigureAwait(false);

                    // Verify that the user has not already received this type of notification for this event
                    if (notifications.Any(un => un.UserNotificationTypeId == (int)NotificationType))
                    {
                        continue;
                    }

                    // Add to the event list to be sent
                    eventsToNotifyUserFor.Add(mobEvent);
                }

                // Populate email
                if (eventsToNotifyUserFor.Any())
                {
                    // Update the database first so that a user is not notified multiple times
                    foreach (var mobEvent in eventsToNotifyUserFor)
                    {
                        var userNotification = new UserNotification
                        {
                            Id = Guid.NewGuid(),
                            EventId = mobEvent.Id,
                            UserId = user.Id,
                            SentDate = DateTimeOffset.UtcNow,
                            UserNotificationTypeId = (int)NotificationType,
                        };

                        await UserNotificationRepository.AddUserNotification(userNotification).ConfigureAwait(false);
                    }

                    var emailTemplate = GetEmailTemplate();
                    var email = new Email();
                    email.Addresses.Add(new EmailAddress() { Email = user.Email, Name = $"{user.GivenName} {user.SurName}" });
                    email.Subject = EmailSubject;
                    email.Message = emailTemplate;

                    // send email
                    await EmailSender.SendEmailAsync(email, cancellationToken);
                }
            }
        }
    }
}
