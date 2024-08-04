namespace TrashMobMobile.Pages;

using TrashMobMobile.Pages.CreateEvent;

public partial class CreateEventPageNew : ContentPage
{
    private readonly CreateEventViewModelNew viewModel;

    public CreateEventPageNew(CreateEventViewModelNew viewModel)
    {
        InitializeComponent();
        this.viewModel = viewModel;
        this.viewModel.Navigation = Navigation;

        viewModel.Steps = new IContentView[]
        {
            new Step1(),
            new Step2(),
            new Step3(),
            new Step4(),
            new Step5(),
            new Step6()
        };

        BindingContext = this.viewModel;
    }

    protected override async void OnNavigatedTo(NavigatedToEventArgs args)
    {
        base.OnNavigatedTo(args);
        await viewModel.Init();
    }
}