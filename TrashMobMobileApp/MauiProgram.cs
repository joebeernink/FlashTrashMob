﻿namespace TrashMobMobileApp;

using System.Reflection;
using CommunityToolkit.Maui;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using TrashMobMobileApp.Authentication;
using TrashMobMobileApp.Config;
using TrashMobMobileApp.Extensions;
using Sentry;

public static class MauiProgram
{
	public static MauiApp CreateMauiApp()
	{
		var builder = MauiApp.CreateBuilder();
		builder
			.UseMauiApp<App>()
			.UseMauiCommunityToolkit()
			.ConfigureFonts(fonts =>
			{
				fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
				fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
			});

        builder.UseSentry(options =>
        {
            // The DSN is the only required setting.
            options.Dsn = "https://4be7fb697cee47ce9554bb64f7d6a476@o4505460799045632.ingest.sentry.io/4505460800225280";

            // Use debug mode if you want to see what the SDK is doing.
            // Debug messages are written to stdout with Console.Writeline,
            // and are viewable in your IDE's debug console or with 'adb logcat', etc.
            // This option is not recommended when deploying your application.
            options.Debug = false;

            // Set TracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
            // We recommend adjusting this value in production.
            options.TracesSampleRate = 1.0;

            // Other Sentry options can be set here.
        });

        // Services
        builder.Services.AddSingleton<AuthHandler>();

        string strAppConfigStreamName;
#if DEBUG
        strAppConfigStreamName = "TrashMobMobileApp.appSettings.Development.json";
#else
        strAppConfigStreamName = "TrashMobMobileApp.appSettings.json"; 
#endif

        var assembly = IntrospectionExtensions.GetTypeInfo(typeof(MauiProgram)).Assembly;
        var stream = assembly.GetManifestResourceStream(strAppConfigStreamName);
        builder.Configuration.AddJsonStream(stream);

        builder.Services.AddHttpClient(AuthConstants.AUTHENTICATED_CLIENT, client =>
		{
			client.BaseAddress = new Uri(AuthConstants.ApiBaseUri);
		}).AddHttpMessageHandler<AuthHandler>();

        builder.Services.Configure<Settings>(options => builder.Configuration.GetSection("Settings").Bind(options));
        builder.Services.AddTrashMobServices();
        builder.Services.AddRestClientServices(builder.Configuration);
        
		// Pages
        builder.Services.AddTransient<MainPage>();
		builder.Services.AddTransient<WelcomePage>();

        // ViewModels
        builder.Services.AddTransient<ContactUsViewModel>();
        builder.Services.AddTransient<CreateEventViewModel>();
        builder.Services.AddTransient<EditEventViewModel>();
        builder.Services.AddTransient<EventSummaryViewModel>();
        builder.Services.AddTransient<HomeViewModel>();
        builder.Services.AddTransient<MainViewModel>();
        builder.Services.AddTransient<MyDashboardViewModel>();
        builder.Services.AddTransient<SearchEventsViewModel>();
        builder.Services.AddTransient<SearchLitterReportsViewModel>();
        builder.Services.AddTransient<SocialMediaShareViewModel>();
        builder.Services.AddTransient<UserLocationPreferenceViewModel>();
        builder.Services.AddTransient<ViewEventViewModel>();
        builder.Services.AddTransient<ViewLitterReportViewModel>();
        builder.Services.AddTransient<WelcomeViewModel>();

#if DEBUG
        builder.Logging.AddDebug();
#endif

		return builder.Build();
	}
}
