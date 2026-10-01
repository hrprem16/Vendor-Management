export const initialRequests = [
  {
    id: "VMT-2026-001",
    consultantName: "Aarav Sharma",
    contactNumber: "+91 9876543210",
    location: "Mumbai, Maharashtra",
    skillRole: "Senior .NET Core Architect",
    joiningDate: "2026-10-15",
    partnerName: "TCS Consultancy",
    portfolioName: "Digital Transformation / Claims Engine",
    projectManager: "Vikram Malhotra",
    billingModel: "HOURLY_TIMESHEET",
    billingCurrency: "INR",
    baseCost: 120000,
    markupPercentage: 15,
    monthlyTotalCost: 138000,
    annualTotalCost: 1656000,
    priorApprovalRef: "APP-DFP-88219",
    vendorRemarks: "Immediate joiner with 10+ years insurance domain experience.",
    
    // Step 2 PM Inputs
    hiringType: "REPLACEMENT",
    reasonForHiring: "Replacement of outgoing contractor",
    justification: "Critical roll-out of claims portal engine.",
    previousConsultantIlomId: "ILOM-9921",
    previousConsultantName: "Rajesh Verma",
    previousRateCard: 150000,
    previousPartner: "TCS Consultancy",
    costVariance: -12000, // Savings of 12000
    
    // Step 4 FC Inputs
    costCenterCode: "CC-MUM-IT-402",
    costCenterDescription: "IT Infrastructure & Cloud Ops",
    
    // Workflow tracking
    currentStep: 2, // PM Review
    status: "PENDING_PM_REVIEW",
    createdAt: "2026-09-28",
    documents: ["CV_Aarav_Sharma.pdf", "Vendor_RateCard_Signed.pdf"]
  },
  {
    id: "VMT-2026-002",
    consultantName: "Priya Sundaram",
    contactNumber: "+91 9822011223",
    location: "Bengaluru, Karnataka",
    skillRole: "Angular Frontend Specialist",
    joiningDate: "2026-10-20",
    partnerName: "Infosys Ltd",
    portfolioName: "Core Policy Admin (Kairos)",
    projectManager: "Ananya Deshmukh",
    billingModel: "FIXED_OPEX",
    billingCurrency: "INR",
    baseCost: 0,
    markupPercentage: 0,
    fixedMonthlyRateCard: 145000,
    monthlyTotalCost: 145000,
    annualTotalCost: 1740000,
    priorApprovalRef: "VP-DIRECT-0091",
    vendorRemarks: "Specialist in RxJS & PrimeNG components.",
    
    hiringType: "NEW_CONSULTANT",
    reasonForHiring: "New Budgeted headcount for Q3 ramp up",
    justification: "Expanding engineering team for mobility app.",
    previousConsultantIlomId: "",
    previousConsultantName: "",
    previousRateCard: 0,
    previousPartner: "",
    costVariance: 145000,
    
    costCenterCode: "CC-BLR-DEV-101",
    costCenterDescription: "Digital Engineering Solutions",
    
    currentStep: 3, // VP Approval
    status: "PENDING_VP_APPROVAL",
    createdAt: "2026-09-29",
    documents: ["CV_Priya_Sundaram.pdf", "Offer_Letter_Draft.pdf"]
  },
  {
    id: "VMT-2026-003",
    consultantName: "Kabir Mehta",
    contactNumber: "+91 9911223344",
    location: "Mumbai, Maharashtra",
    skillRole: "Enterprise Solutions Architect",
    joiningDate: "2026-10-18",
    partnerName: "Wipro Technologies",
    portfolioName: "Core Analytics",
    projectManager: "Rajesh Gupta",
    billingModel: "HOURLY_TIMESHEET",
    billingCurrency: "INR",
    baseCost: 160000,
    markupPercentage: 12,
    monthlyTotalCost: 179200,
    annualTotalCost: 2150400,
    priorApprovalRef: "DFP-EXEC-0012",
    vendorRemarks: "High priority executive hiring",

    hiringType: "NEW_CONSULTANT",
    reasonForHiring: "Core analytics data pipeline",
    justification: "Strategic initiative",
    
    currentStep: 4, // FC Review
    status: "PENDING_FC_REVIEW",
    createdAt: "2026-09-29",
    documents: ["CV_Kabir_Mehta.pdf", "VP_Approved_DFP.pdf"]
  },
  {
    id: "VMT-2026-004",
    consultantName: "Rohan Kulkarni",
    contactNumber: "+91 9711002288",
    location: "Pune, Maharashtra",
    skillRole: "AWS Cloud DevOps Engineer",
    joiningDate: "2026-10-05",
    partnerName: "Wipro Technologies",
    portfolioName: "Cloud Migration & Security",
    projectManager: "Vikram Malhotra",
    billingModel: "HOURLY_TIMESHEET",
    billingCurrency: "INR",
    baseCost: 130000,
    markupPercentage: 10,
    monthlyTotalCost: 143000,
    annualTotalCost: 1716000,
    priorApprovalRef: "REF-WIPRO-401",
    vendorRemarks: "Certified AWS Solutions Architect",
    
    hiringType: "NEW_CONSULTANT",
    reasonForHiring: "AWS Migration project phase 2",
    justification: "Automating ECS Fargate deployment pipelines.",
    
    costCenterCode: "CC-PUN-CLOUD-909",
    costCenterDescription: "Cloud Enterprise Security",
    
    currentStep: 6, // Onboarding Confirmation Pending
    status: "PENDING_ONBOARDING_DOCS",
    createdAt: "2026-09-20",
    documents: ["CV_Rohan_Kulkarni.pdf", "VP_Approval_Mail.pdf"]
  },
  {
    id: "VMT-2026-005",
    consultantName: "Neha Agarwal",
    contactNumber: "+91 9833445566",
    location: "Bengaluru, Karnataka",
    skillRole: "PostgreSQL & Database Admin",
    joiningDate: "2026-10-10",
    partnerName: "LTI Mindtree",
    portfolioName: "Database Engineering",
    projectManager: "Ananya Deshmukh",
    billingModel: "FIXED_OPEX",
    billingCurrency: "INR",
    fixedMonthlyRateCard: 135000,
    monthlyTotalCost: 135000,
    annualTotalCost: 1620000,

    vendorPayrollId: "LTI-EMP-5512",
    actualJoiningDate: "2026-10-01",
    panNumber: "FGHIJ5678K",
    
    currentStep: 8, // AD Team Action Required
    status: "PENDING_AD_CREATION",
    createdAt: "2026-09-15",
    documents: ["CV_Neha_Agarwal.pdf", "PAN_Card_Proof.pdf", "Offer_Letter.pdf"]
  },
  {
    id: "VMT-2026-006",
    consultantName: "Meera Nair",
    contactNumber: "+91 9900881122",
    location: "Hyderabad, Telangana",
    skillRole: "Data Engineer / PostgreSQL Specialist",
    joiningDate: "2026-09-01",
    partnerName: "LTI Mindtree",
    portfolioName: "Data Analytics & Reporting",
    projectManager: "Ananya Deshmukh",
    billingModel: "FIXED_CAPEX",
    billingCurrency: "INR",
    fixedMonthlyRateCard: 160000,
    monthlyTotalCost: 160000,
    annualTotalCost: 1920000,
    
    ilomId: "ILOM-883401",
    vendorPayrollId: "LTI-PAY-7712",
    panNumber: "ABCDE1234F",
    actualJoiningDate: "2026-09-01",
    
    currentStep: 10, // Active Consultant
    status: "ACTIVE",
    createdAt: "2026-08-15",
    documents: ["CV_Meera_Nair.pdf", "PAN_Proof.pdf", "Joining_Report.pdf"]
  },
  {
    id: "VMT-2026-007",
    consultantName: "Sanjay Joshi",
    contactNumber: "+91 9899112233",
    location: "Mumbai, Maharashtra",
    skillRole: "Cybersecurity Analyst",
    joiningDate: "2026-07-01",
    partnerName: "TCS Consultancy",
    portfolioName: "Security Operations",
    projectManager: "Vikram Malhotra",
    billingModel: "HOURLY_TIMESHEET",
    billingCurrency: "INR",
    baseCost: 140000,
    markupPercentage: 10,
    monthlyTotalCost: 154000,
    annualTotalCost: 1848000,

    ilomId: "ILOM-771202",
    vendorPayrollId: "TCS-CYBER-091",
    panNumber: "KLMNO9012P",
    actualJoiningDate: "2026-07-01",

    currentStep: 11, // Offboarding Initiated
    status: "OFFBOARDING_INITIATED",
    adRevoked: true,
    assetReturned: true,
    timesheetSubmitted: true,
    createdAt: "2026-06-10",
    documents: ["Exit_Request_Form.pdf"]
  }
];

export const auditLogsSample = [
  {
    id: "LOG-1001",
    ticketNo: "VMT-2026-001",
    action: "VENDOR_SUBMISSION",
    performedBy: "TCS Vendor Desk",
    timestamp: "2026-09-28 10:30:15",
    details: "Initiated onboarding request for Aarav Sharma."
  },
  {
    id: "LOG-1002",
    ticketNo: "VMT-2026-002",
    action: "PM_APPROVAL",
    performedBy: "Ananya Deshmukh (PM)",
    timestamp: "2026-09-29 14:12:00",
    details: "Enriched replacement rate card variance & approved profile for VP review."
  },
  {
    id: "LOG-1003",
    ticketNo: "VMT-2026-003",
    action: "VP_APPROVAL",
    performedBy: "Arif Merchant (VP)",
    timestamp: "2026-09-29 16:00:00",
    details: "DFP adherence verified for executive hiring. Forwarded to Financial Controller."
  },
  {
    id: "LOG-1004",
    ticketNo: "VMT-2026-005",
    action: "ONBOARDING_CONFIRMATION",
    performedBy: "LTI Mindtree Desk",
    timestamp: "2026-09-16 11:20:00",
    details: "Confirmed actual joining date and uploaded candidate PAN & Offer letter proof."
  },
  {
    id: "LOG-1005",
    ticketNo: "VMT-2026-006",
    action: "KAIROS_AUTO_SYNC",
    performedBy: "Kairos Integration Worker",
    timestamp: "2026-08-16 09:00:00",
    details: "Auto created consultant record in Kairos Policy Admin ERP."
  }
];
