﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TrashMob.Shared.Persistence;

#pragma warning disable CS8981

namespace TrashMob.Migrations
{
    [DbContext(typeof(MobDbContext))]
    [Migration("20210417024637_removegps")]
    partial class removegps
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.4")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("TrashMob.Models.ContactRequest", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset?>("CreatedDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Message")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("ContactRequests");
                });

            modelBuilder.Entity("TrashMob.Models.Event", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int?>("ActualNumberOfParticipants")
                        .HasColumnType("int");

                    b.Property<string>("City")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("Country")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("nvarchar(64)");

                    b.Property<Guid>("CreatedByUserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset?>("CreatedDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(2048)
                        .HasColumnType("nvarchar(2048)");

                    b.Property<DateTimeOffset>("EventDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<int>("EventStatusId")
                        .HasColumnType("int");

                    b.Property<int>("EventTypeId")
                        .HasColumnType("int");

                    b.Property<Guid>("LastUpdatedByUserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset?>("LastUpdatedDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<double?>("Latitude")
                        .HasColumnType("float");

                    b.Property<double?>("Longitude")
                        .HasColumnType("float");

                    b.Property<int?>("MaxNumberOfParticipants")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("nvarchar(64)");

                    b.Property<string>("PostalCode")
                        .IsRequired()
                        .HasMaxLength(25)
                        .HasColumnType("nvarchar(25)");

                    b.Property<string>("Region")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("StreetAddress")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("CreatedByUserId");

                    b.HasIndex("EventStatusId");

                    b.HasIndex("EventTypeId");

                    b.HasIndex("LastUpdatedByUserId");

                    b.ToTable("Events");
                });

            modelBuilder.Entity("TrashMob.Models.EventAttendee", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("EventId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset?>("CanceledDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<DateTimeOffset>("SignUpDate")
                        .HasColumnType("datetimeoffset");

                    b.HasKey("UserId", "EventId");

                    b.HasIndex("EventId");

                    b.ToTable("EventAttendees");
                });

            modelBuilder.Entity("TrashMob.Models.EventHistory", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int?>("ActualNumberOfParticipants")
                        .HasColumnType("int");

                    b.Property<string>("City")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("Country")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("nvarchar(64)");

                    b.Property<Guid>("CreatedByUserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset?>("CreatedDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(2048)
                        .HasColumnType("nvarchar(2048)");

                    b.Property<DateTimeOffset>("EventDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<Guid>("EventId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("EventStatusId")
                        .HasColumnType("int");

                    b.Property<int>("EventTypeId")
                        .HasColumnType("int");

                    b.Property<Guid>("LastUpdatedByUserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset?>("LastUpdatedDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<double?>("Latitude")
                        .HasColumnType("float");

                    b.Property<double?>("Longitude")
                        .HasColumnType("float");

                    b.Property<int?>("MaxNumberOfParticipants")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("nvarchar(64)");

                    b.Property<string>("PostalCode")
                        .IsRequired()
                        .HasMaxLength(25)
                        .HasColumnType("nvarchar(25)");

                    b.Property<string>("Region")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("StreetAddress")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.ToTable("EventHistory");
                });

            modelBuilder.Entity("TrashMob.Models.EventStatus", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("DisplayOrder")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Id");

                    b.ToTable("EventStatuses");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Description = "Event is actively recruiting new members",
                            DisplayOrder = 1,
                            Name = "Active"
                        },
                        new
                        {
                            Id = 2,
                            Description = "Event is full",
                            DisplayOrder = 2,
                            Name = "Full"
                        },
                        new
                        {
                            Id = 3,
                            Description = "Event has been canceled",
                            DisplayOrder = 3,
                            Name = "Canceled"
                        },
                        new
                        {
                            Id = 4,
                            Description = "Event has completed",
                            DisplayOrder = 4,
                            Name = "Completed"
                        });
                });

            modelBuilder.Entity("TrashMob.Models.EventType", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("DisplayOrder")
                        .HasColumnType("int");

                    b.Property<bool?>("IsActive")
                        .HasColumnType("bit");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Id");

                    b.ToTable("EventTypes");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Description = "Park Cleanup",
                            DisplayOrder = 1,
                            IsActive = true,
                            Name = "Park Cleanup"
                        },
                        new
                        {
                            Id = 2,
                            Description = "School Cleanup",
                            DisplayOrder = 2,
                            IsActive = true,
                            Name = "School Cleanup"
                        },
                        new
                        {
                            Id = 3,
                            Description = "Neighborhood Cleanup",
                            DisplayOrder = 3,
                            IsActive = true,
                            Name = "Neighborhood Cleanup"
                        },
                        new
                        {
                            Id = 4,
                            Description = "Beach Cleanup",
                            DisplayOrder = 4,
                            IsActive = true,
                            Name = "Beach Cleanup"
                        },
                        new
                        {
                            Id = 5,
                            Description = "Highway Cleanup",
                            DisplayOrder = 5,
                            IsActive = true,
                            Name = "Highway Cleanup"
                        },
                        new
                        {
                            Id = 6,
                            Description = "Natural Disaster Cleanup",
                            DisplayOrder = 6,
                            IsActive = true,
                            Name = "Natural Disaster Cleanup"
                        },
                        new
                        {
                            Id = 7,
                            Description = "Trail Cleanup",
                            DisplayOrder = 7,
                            IsActive = true,
                            Name = "Trail Cleanup"
                        },
                        new
                        {
                            Id = 8,
                            Description = "Reef Cleanup",
                            DisplayOrder = 8,
                            IsActive = true,
                            Name = "Reef Cleanup"
                        },
                        new
                        {
                            Id = 9,
                            Description = "Private Land Cleanup",
                            DisplayOrder = 9,
                            IsActive = true,
                            Name = "Private Land Cleanup"
                        },
                        new
                        {
                            Id = 10,
                            Description = "Dog Park Cleanup",
                            DisplayOrder = 10,
                            IsActive = true,
                            Name = "Dog Park Cleanup"
                        },
                        new
                        {
                            Id = 11,
                            Description = "Waterway Cleanup",
                            DisplayOrder = 11,
                            IsActive = true,
                            Name = "Waterway Cleanup"
                        },
                        new
                        {
                            Id = 12,
                            Description = "Vandalism Cleanup",
                            DisplayOrder = 12,
                            IsActive = true,
                            Name = "Vandalism Cleanup"
                        },
                        new
                        {
                            Id = 13,
                            Description = "Social Event",
                            DisplayOrder = 13,
                            IsActive = true,
                            Name = "Social Event"
                        },
                        new
                        {
                            Id = 14,
                            Description = "Other",
                            DisplayOrder = 14,
                            IsActive = true,
                            Name = "Other"
                        });
                });

            modelBuilder.Entity("TrashMob.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("City")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Country")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTimeOffset?>("DateAgreedToPrivacyPolicy")
                        .HasColumnType("datetimeoffset");

                    b.Property<DateTimeOffset?>("DateAgreedToTermsOfService")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("GivenName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTimeOffset?>("MemberSince")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NameIdentifier")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PostalCode")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PrivacyPolicyVersion")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Region")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SurName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TermsOfServiceVersion")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("UserName")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("TrashMob.Models.Event", b =>
                {
                    b.HasOne("TrashMob.Models.User", "CreatedByUser")
                        .WithMany("EventsCreated")
                        .HasForeignKey("CreatedByUserId")
                        .HasConstraintName("FK_Events_ApplicationUser_CreatedBy")
                        .IsRequired();

                    b.HasOne("TrashMob.Models.EventStatus", "EventStatus")
                        .WithMany("Events")
                        .HasForeignKey("EventStatusId")
                        .HasConstraintName("FK_Events_EventStatuses")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TrashMob.Models.EventType", "EventType")
                        .WithMany("Events")
                        .HasForeignKey("EventTypeId")
                        .HasConstraintName("FK_Events_EventTypes")
                        .IsRequired();

                    b.HasOne("TrashMob.Models.User", "LastUpdatedByUser")
                        .WithMany("EventsUpdated")
                        .HasForeignKey("LastUpdatedByUserId")
                        .HasConstraintName("FK_Events_ApplicationUser_LastUpdatedBy")
                        .IsRequired();

                    b.Navigation("CreatedByUser");

                    b.Navigation("EventStatus");

                    b.Navigation("EventType");

                    b.Navigation("LastUpdatedByUser");
                });

            modelBuilder.Entity("TrashMob.Models.EventAttendee", b =>
                {
                    b.HasOne("TrashMob.Models.Event", "Event")
                        .WithMany()
                        .HasForeignKey("EventId")
                        .HasConstraintName("FK_EventAttendees_Events")
                        .IsRequired();

                    b.HasOne("TrashMob.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .HasConstraintName("FK_EventAttendees_ApplicationUser")
                        .IsRequired();

                    b.Navigation("Event");

                    b.Navigation("User");
                });

            modelBuilder.Entity("TrashMob.Models.EventStatus", b =>
                {
                    b.Navigation("Events");
                });

            modelBuilder.Entity("TrashMob.Models.EventType", b =>
                {
                    b.Navigation("Events");
                });

            modelBuilder.Entity("TrashMob.Models.User", b =>
                {
                    b.Navigation("EventsCreated");

                    b.Navigation("EventsUpdated");
                });
#pragma warning restore 612, 618
        }
    }
}
