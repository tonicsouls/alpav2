export interface SampleDocument {
    name: string;
    content: string;
}

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
    {
        name: 'invoice_tech_solutions.txt',
        content: `
INVOICE

To: Tech Solutions Inc.
From: Web Services LLC
Date: 2023-10-26
Invoice # 12345

Description      | Amount
-----------------|-------
Web Hosting      | $50.00
Domain Renewal   | $15.00
-----------------|-------
TOTAL            | $65.00

Please remit payment to account ACC-123456789.
`
    },
    {
        name: 'contract_wayne_enterprises.txt',
        content: `
SERVICE AGREEMENT

This agreement is made between Secure Systems Ltd. and Wayne Enterprises.
Term: 24 months
Services: Security infrastructure monitoring and maintenance.
Start Date: 2023-11-01

Point of Contact: James Wilson (j.wilson@wayne.ent)
`
    },
    {
        name: 'w2_michael_brown_pii.txt',
        content: `
Form W-2 Wage and Tax Statement 2023

Employer: Initech Inc
Employee: Michael Brown
Address: 123 Office Park, Austin, TX

SSN: XXX-XX-6789

Wages: $75,000
Federal Tax Withheld: $12,000
`
    },
    {
        name: 'unknown_customer_loan_app.txt',
        content: `
LOAN APPLICATION

Applicant: Mark Watney
Address: 456 Mars Ave, Houston, TX
Loan Amount: $10,000
Purpose: Personal Loan

This application is for internal review only.
`
    },
    {
        name: 'meeting_notes.txt',
        content: `
Project Phoenix - Meeting Notes - 2023-10-25

Attendees: Alice, Bob, Charlie

Agenda:
- Review Q3 performance
- Plan Q4 roadmap
- Discuss budget allocation

Action Items:
- Alice to finalize the Q4 presentation deck.
- Bob to schedule a follow-up with the marketing team.
`
    }
];
