using CEZ3._0.Application.Interfaces;
using System.Net;
using System.Net.Mail;

namespace CEZ3._0.Application.Services;

public class EmailSender : IEmailSender
{
    public async Task SendEmailAsync(string email, string subject, string message)
    {
        var smtpHost = Environment.GetEnvironmentVariable("Smtp_Host");
        var smtpPort = int.Parse(Environment.GetEnvironmentVariable("Smtp_Port")!);
        var smtpUser = Environment.GetEnvironmentVariable("Smtp_Username");
        var smtpPass = Environment.GetEnvironmentVariable("SMTP_PASSWORD");
        var fromEmail = Environment.GetEnvironmentVariable("Smtp_From");

        using var client = new SmtpClient(smtpHost, smtpPort)
        {
            Credentials = new NetworkCredential(smtpUser, smtpPass),
            EnableSsl = true
        };
        var mailMessage = new MailMessage
        {
            From = new MailAddress(fromEmail!),
            Subject = subject,
            Body = message,
            IsBodyHtml = true
        };
        mailMessage.To.Add(email);

        await client.SendMailAsync(mailMessage);
    }
}
