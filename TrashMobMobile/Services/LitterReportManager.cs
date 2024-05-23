﻿namespace TrashMobMobile.Data
{
    using TrashMob.Models;

    public class LitterReportManager : ILitterReportManager
    {
        private readonly ILitterReportRestService litterReportRestService;

        public LitterReportManager(ILitterReportRestService litterReportRestService)
        {
            this.litterReportRestService = litterReportRestService;
        }

        public Task<IEnumerable<LitterReport>> GetAllLitterReportsAsync(CancellationToken cancellationToken = default)
        {
            return litterReportRestService.GetAllLitterReportsAsync(cancellationToken);
        }

        public Task<IEnumerable<LitterReport>> GetNewLitterReportsAsync(CancellationToken cancellationToken = default)
        {
            return litterReportRestService.GetNewLitterReportsAsync(cancellationToken);
        }

        public Task<IEnumerable<LitterReport>> GetAssignedLitterReportsAsync(
            CancellationToken cancellationToken = default)
        {
            return litterReportRestService.GetAssignedLitterReportsAsync(cancellationToken);
        }

        public Task<IEnumerable<LitterReport>> GetCleanedLitterReportsAsync(
            CancellationToken cancellationToken = default)
        {
            return litterReportRestService.GetCleanedLitterReportsAsync(cancellationToken);
        }

        public Task<IEnumerable<LitterReport>> GetNotCancelledLitterReportsAsync(
            CancellationToken cancellationToken = default)
        {
            return litterReportRestService.GetNotCancelledLitterReportsAsync(cancellationToken);
        }

        public Task<IEnumerable<LitterReport>> GetCancelledLitterReportsAsync(
            CancellationToken cancellationToken = default)
        {
            return litterReportRestService.GetNotCancelledLitterReportsAsync(cancellationToken);
        }

        public Task<IEnumerable<LitterReport>> GetUserLitterReportsAsync(Guid userId,
            CancellationToken cancellationToken = default)
        {
            return litterReportRestService.GetUserLitterReportsAsync(userId, cancellationToken);
        }

        public async Task<LitterReport> GetLitterReportAsync(Guid litterReportId, ImageSizeEnum imageSize,
            CancellationToken cancellationToken = default)
        {
            var litterReport = await litterReportRestService.GetLitterReportAsync(litterReportId, cancellationToken);

            foreach (var litterImage in litterReport.LitterImages)
            {
                litterImage.AzureBlobURL =
                    await litterReportRestService.GetLitterImageUrlAsync(litterImage.Id, imageSize, cancellationToken);
            }

            return litterReport;
        }

        public Task<LitterReport> UpdateLitterReportAsync(LitterReport litterReport,
            CancellationToken cancellationToken = default)
        {
            return litterReportRestService.UpdateLitterReportAsync(litterReport, cancellationToken);
        }

        public Task<LitterReport> AddLitterReportAsync(LitterReport litterReport,
            CancellationToken cancellationToken = default)
        {
            return litterReportRestService.AddLitterReportAsync(litterReport, cancellationToken);
        }

        public Task DeleteLitterReportAsync(Guid litterReportId, CancellationToken cancellationToken = default)
        {
            return litterReportRestService.DeleteLitterReportAsync(litterReportId, cancellationToken);
        }
    }
}