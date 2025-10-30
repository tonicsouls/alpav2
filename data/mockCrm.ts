export interface CustomerRecord {
    shortId: string;
    fullName: string;
    email: string;
    company: string;
    accountNumber: string;
}

export const MOCK_CRM_RECORDS: CustomerRecord[] = [
    { shortId: 'JS-11223', fullName: 'Jane Smith', email: 'jane.smith@example.com', company: 'Innovate LLC', accountNumber: 'ACC-987654321' },
    { shortId: 'JD-98765', fullName: 'John Doe', email: 'john.doe@email.com', company: 'Tech Solutions Inc.', accountNumber: 'ACC-123456789' },
    { shortId: 'ACME-12345', fullName: 'William Anderson', email: 'will.anderson@acmecorp.com', company: 'Acme Corp', accountNumber: 'ACC-555444333' },
    { shortId: 'GLOBEX-45678', fullName: 'Susan Richards', email: 's.richards@globex.com', company: 'Globex Corporation', accountNumber: 'ACC-111222333' },
    { shortId: 'INIT-54321', fullName: 'Michael Brown', email: 'mbrown@initech.com', company: 'Initech Inc', accountNumber: 'ACC-777888999' },
    { shortId: 'OCP-65432', fullName: 'Robert Jones', email: 'rob.jones@ocp.com', company: 'Omni Consumer Products', accountNumber: 'ACC-654321987' },
    { shortId: 'CYBER-78901', fullName: 'Patricia Miller', email: 'p.miller@cyberdyne.net', company: 'Cyberdyne Systems', accountNumber: 'ACC-789012345' },
    { shortId: 'WAYNE-34567', fullName: 'James Wilson', email: 'j.wilson@wayne.ent', company: 'Wayne Enterprises', accountNumber: 'ACC-345678901' },
    { shortId: 'STARK-87654', fullName: 'Mary Davis', email: 'mary.d@stark-ind.com', company: 'Stark Industries', accountNumber: 'ACC-876543210' },
    { shortId: 'UMBR-23456', fullName: 'David Garcia', email: 'd.garcia@umbrella.corp', company: 'Umbrella Corporation', accountNumber: 'ACC-234567890' },
    { shortId: 'TYRELL-19820', fullName: 'Linda Rodriguez', email: 'linda.r@tyrellcorp.com', company: 'Tyrell Corporation', accountNumber: 'ACC-198203456' },
    { shortId: 'SOY-20220', fullName: 'Charles Martinez', email: 'c.martinez@soylent.com', company: 'Soylent Corp', accountNumber: 'ACC-202209876' },
    { shortId: 'VERY-BIG-CORP', fullName: 'Barbara Hernandez', email: 'barb.h@vbc.com', company: 'Very Big Corporation', accountNumber: 'ACC-888777666' },
    { shortId: 'MASS-FUSION', fullName: 'Richard Lopez', email: 'rick.lopez@massfusion.com', company: 'Massive Fusion', accountNumber: 'ACC-101010101' },
    { shortId: 'APERTURE-SCI', fullName: 'Elizabeth Gonzalez', email: 'liz.g@aperturescience.com', company: 'Aperture Science', accountNumber: 'ACC-202020202' },
    { shortId: 'BLACK-MESA', fullName: 'Joseph Perez', email: 'joe.perez@blackmesa.res', company: 'Black Mesa Research', accountNumber: 'ACC-303030303' },
    { shortId: 'BLUE-SUN', fullName: 'Jennifer Williams', email: 'jen.w@bluesun.co', company: 'Blue Sun Corporation', accountNumber: 'ACC-404040404' },
    { shortId: 'CHOAM-INC', fullName: 'Christopher Moore', email: 'chris.m@choam.com', company: 'CHOAM', accountNumber: 'ACC-505050505' },
    { shortId: 'REKO-LLC', fullName: 'Jessica Taylor', email: 'jess.t@rekall.net', company: 'Rekall', accountNumber: 'ACC-606060606' },
    { shortId: 'VERSA-LIFE', fullName: 'Daniel Anderson', email: 'dan.a@versalife.com', company: 'VersaLife', accountNumber: 'ACC-707070707' },
    { shortId: 'YOYO-DYN', fullName: 'Sarah Thomas', email: 'sarah.t@yoyodyne.com', company: 'Yoyodyne Propulsion', accountNumber: 'ACC-808080808' },
    { shortId: 'ZOR-GIND', fullName: 'Matthew Jackson', email: 'matt.j@zorg.com', company: 'Zorg Industries', accountNumber: 'ACC-909090909' },
    { shortId: 'BIOC-ORP', fullName: 'Nancy White', email: 'nancy.w@biocorp.com', company: 'BioCorp', accountNumber: 'ACC-112112112' },
    { shortId: 'DATA-DYN', fullName: 'Anthony Harris', email: 'anthony.h@datadyne.com', company: 'DataDyne', accountNumber: 'ACC-221221221' },
    { shortId: 'EURO-CORP', fullName: 'Karen Martin', email: 'karen.m@eurocorp.com', company: 'EuroCorp', accountNumber: 'ACC-332332332' }
];
