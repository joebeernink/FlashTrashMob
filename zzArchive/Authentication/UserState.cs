﻿namespace TrashMobMobileApp.Authentication
{
    public class UserState
    {
        public static UserContext UserContext { get; set; } = new UserContext();

        public static bool IsDeleting { get; set; } = false;
    }
}