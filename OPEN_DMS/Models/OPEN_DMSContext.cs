using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace OPEN_DMS.Models
{
    public partial class OPEN_DMSContext : DbContext
    {
        public OPEN_DMSContext()
        {
        }

        public OPEN_DMSContext(DbContextOptions<OPEN_DMSContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Document> Documents { get; set; }
        public virtual DbSet<Entity> Entities { get; set; }
        public virtual DbSet<Mimetype> Mimetypes { get; set; }
        public virtual DbSet<Team> Teams { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseMySQL("server=127.0.0.1;uid=root;pwd=123456;database=OPEN_DMS");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Document>(entity =>
            {
                entity.ToTable("documents");

                entity.Property(e => e.Id)
                    .HasColumnType("int(11)")
                    .HasColumnName("id");

                entity.Property(e => e.CommentDetail).HasColumnName("commentDetail");

                entity.Property(e => e.Disabled).HasColumnName("disabled");

                entity.Property(e => e.DistinctDetail).HasColumnName("distinctDetail");

                entity.Property(e => e.EntityId)
                    .HasColumnType("int(11)")
                    .HasColumnName("entityId");

                entity.Property(e => e.Extension)
                    .IsRequired()
                    .HasMaxLength(5)
                    .HasColumnName("extension");

                entity.Property(e => e.FileName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("fileName");

                entity.Property(e => e.IdUser)
                    .HasColumnType("int(11)")
                    .HasColumnName("idUser");

                entity.Property(e => e.InsertionDate)
                    .HasColumnType("date")
                    .HasColumnName("insertionDate");

                entity.Property(e => e.PathAlternative).HasColumnName("pathAlternative");

                entity.Property(e => e.Size).HasColumnName("size");

                entity.Property(e => e.TeamId)
                    .HasColumnType("int(11)")
                    .HasColumnName("teamId");
            });

            modelBuilder.Entity<Entity>(entity =>
            {
                entity.ToTable("entities");

                entity.Property(e => e.Id)
                    .HasColumnType("int(11)")
                    .HasColumnName("id");

                entity.Property(e => e.Disabled).HasColumnName("disabled");

                entity.Property(e => e.EntityName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("entityName");
            });

            modelBuilder.Entity<Mimetype>(entity =>
            {
                entity.ToTable("mimetypes");

                entity.Property(e => e.Id)
                    .HasColumnType("int(11)")
                    .HasColumnName("id");

                entity.Property(e => e.Extension)
                    .IsRequired()
                    .HasMaxLength(5)
                    .HasColumnName("extension");

                entity.Property(e => e.KinfOfDocument).HasColumnName("kinf_of_document");

                entity.Property(e => e.MimeType1)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("mime_type");
            });

            modelBuilder.Entity<Team>(entity =>
            {
                entity.ToTable("teams");

                entity.Property(e => e.Id)
                    .HasColumnType("int(11)")
                    .HasColumnName("id");

                entity.Property(e => e.Disabled).HasColumnName("disabled");

                entity.Property(e => e.Email)
                    .HasMaxLength(50)
                    .HasColumnName("email");

                entity.Property(e => e.EntityId)
                    .HasColumnType("int(11)")
                    .HasColumnName("entityId");

                entity.Property(e => e.HostName)
                    .HasMaxLength(30)
                    .HasColumnName("hostName");

                entity.Property(e => e.Pass)
                    .HasMaxLength(50)
                    .HasColumnName("pass");

                entity.Property(e => e.PathRoot)
                    .IsRequired()
                    .HasColumnName("pathRoot");

                entity.Property(e => e.PortNumber)
                    .HasColumnType("int(11)")
                    .HasColumnName("portNumber");

                entity.Property(e => e.TeamName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("teamName");

                entity.Property(e => e.TelephoneNumber)
                    .HasMaxLength(50)
                    .HasColumnName("telephoneNumber");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.Property(e => e.Id)
                    .HasColumnType("int(11)")
                    .HasColumnName("id");

                entity.Property(e => e.AccessLevel)
                    .HasMaxLength(20)
                    .HasColumnName("accessLevel");

                entity.Property(e => e.CompleteName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("completeName");

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("date")
                    .HasColumnName("createdDate");

                entity.Property(e => e.Description).HasColumnName("description");

                entity.Property(e => e.Disabled).HasColumnName("disabled");

                entity.Property(e => e.EntityId)
                    .HasColumnType("int(11)")
                    .HasColumnName("entityId");

                entity.Property(e => e.ExpirationDate)
                    .HasColumnType("date")
                    .HasColumnName("expirationDate");

                entity.Property(e => e.TeamId)
                    .HasColumnType("int(11)")
                    .HasColumnName("teamId");

                entity.Property(e => e.UserAccount)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("userAccount");

                entity.Property(e => e.UserPassword)
                    .IsRequired()
                    .HasMaxLength(80)
                    .HasColumnName("userPassword");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
