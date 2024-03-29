﻿namespace TrashMobMobile.Extensions
{
    using TrashMob.Models;

    public static class LitterReportExtensions
    {
        public static LitterReportViewModel ToLitterReportViewModel(this LitterReport litterReport)
        {
            return new LitterReportViewModel
            {
                Id = litterReport.Id,
                Name = litterReport.Name,
                Description = litterReport.Description,
                LitterReportStatusId = litterReport.LitterReportStatusId,
            };
        }

        public static LitterReport ToLitterReport(this LitterReportViewModel litterReportViewModel)
        {
            return new LitterReport
            {
                Id = litterReportViewModel.Id,
                Name = litterReportViewModel.Name,
                Description = litterReportViewModel.Description,
                LitterReportStatusId = litterReportViewModel.LitterReportStatusId,
            };
        }
    }
}
