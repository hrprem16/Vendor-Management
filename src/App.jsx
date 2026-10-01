import React, { useState } from 'react';
import { 
  Building2, UserCheck, ShieldCheck, DollarSign, Cpu, Key, Database, FileSpreadsheet, 
  PlusCircle, RefreshCw, LogOut, FileText, CheckCircle2, XCircle, ArrowLeftRight, 
  Upload, Search, Filter, AlertCircle, Eye, ChevronRight, Layers, Award, Sparkles, Download, CheckSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { initialRequests, auditLogsSample } from './mockData';

export default function App() {
  const [requests, setRequests] = useState(initialRequests);
  const [auditLogs, setAuditLogs] = useState(auditLogsSample);
  const [currentRole, setCurrentRole] = useState('PM'); // VENDOR, PM, VP, FC, HARDWARE, AD_TEAM, ADMIN
  const [activeTab, setActiveTab] = useState('PIPELINE'); // DASHBOARD, NEW_REQUEST, PIPELINE, RATE_AMENDMENT, OFFBOARDING, REPORTS
  const [filterByRoleOnly, setFilterByRoleOnly] = useState(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');

  // Selected Request for Modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Bulk Upload Modal
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  // Step 1 Form State
  const [formData, setFormData] = useState({
    consultantName: '',
    contactNumber: '',
    location: 'Mumbai, Maharashtra',
    skillRole: '',
    joiningDate: '',
    partnerName: 'TCS Consultancy',
    portfolioName: 'Digital Transformation',
    projectManager: 'Vikram Malhotra',
    billingModel: 'HOURLY_TIMESHEET',
    billingCurrency: 'INR',
    baseCost: 120000,
    markupPercentage: 10,
    fixedMonthlyRateCard: 0,
    priorApprovalRef: '',
    vendorRemarks: ''
  });

  // PM Step 2 Form State
  const [pmData, setPmData] = useState({
    hiringType: 'NEW_CONSULTANT',
    reasonForHiring: 'Ramp-up for Q3 delivery',
    justification: 'Approved project budget',
    previousConsultantIlomId: '',
    previousConsultantName: '',
    previousRateCard: 0,
    previousPartner: '',
    comments: ''
  });

  // FC Step 4 Form State
  const [fcCostCenter, setFcCostCenter] = useState('CC-MUM-IT-402');

  // Step 6 Onboarding State
  const [onboardingForm, setOnboardingForm] = useState({
    vendorPayrollId: '',
    actualJoiningDate: '',
    panNumber: ''
  });

  // Step 8 AD Team State
  const [ilomInput, setIlomInput] = useState('');

  // Step 10 Rate Amendment Form State
  const [rateAmendmentForm, setRateAmendmentForm] = useState({
    consultantId: '',
    newRate: 155000,
    reason: 'Annual performance appraisal rate revision',
    initiatedBy: 'VENDOR'
  });

  // Calculations for Step 1
  const calculateCosts = () => {
    let monthly = 0;
    if (formData.billingModel === 'HOURLY_TIMESHEET') {
      monthly = Number(formData.baseCost) + (Number(formData.baseCost) * (Number(formData.markupPercentage) / 100));
    } else {
      monthly = Number(formData.fixedMonthlyRateCard);
    }
    const annual = monthly * 12;
    return { monthly, annual };
  };

  const { monthly: computedMonthlyCost, annual: computedAnnualCost } = calculateCosts();

  // Role Descriptions & Actionable Step Mapping
  const roleConfig = {
    VENDOR: { title: "Vendor Partner Desk", icon: "🏢", step: 1, desc: "Create candidate requests, confirm onboarding docs & submit rate addendums." },
    PM: { title: "Portfolio Manager Desk", icon: "👨‍💼", step: 2, desc: "Review candidate profiles, specify New vs Replacement, and compute rate card savings." },
    VP: { title: "VP DFP Approval Desk", icon: "🛡️", step: 3, desc: "Evaluate financial compliance, DFP adherence, and approve or pushback high spend profiles." },
    FC: { title: "Financial Controller Desk", icon: "💰", step: 4, desc: "Assign Cost Centres, grant financial clearance, and sign off on offboarding exits." },
    HARDWARE: { title: "Asset / Hardware Allocation Desk", icon: "💻", step: 5, desc: "Track auto-triggered hardware allocation requests for joining consultants." },
    AD_TEAM: { title: "Active Directory & Access Team", icon: "🆔", step: 8, desc: "Create Active Directory accounts, assign official ILOM IDs & trigger Kairos auto-sync." },
    ADMIN: { title: "System Administrator & Kairos ERP", icon: "⚙️", step: 9, desc: "Full administrative oversight, Kairos integration monitoring & system audit trails." }
  };

  // Helper to filter list based on role
  const matchesRoleFilter = (req) => {
    if (!filterByRoleOnly || currentRole === 'ADMIN') return true;
    switch (currentRole) {
      case 'VENDOR': return req.currentStep === 1 || req.currentStep === 6;
      case 'PM': return req.currentStep === 2;
      case 'VP': return req.currentStep === 3;
      case 'FC': return req.currentStep === 4 || req.currentStep === 11;
      case 'HARDWARE': return req.currentStep === 5;
      case 'AD_TEAM': return req.currentStep === 8;
      default: return true;
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.consultantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.partnerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = matchesRoleFilter(r);

    if (stageFilter === 'ALL') return matchesSearch && matchesRole;
    if (stageFilter === 'PM') return matchesSearch && matchesRole && r.currentStep === 2;
    if (stageFilter === 'VP') return matchesSearch && matchesRole && r.currentStep === 3;
    if (stageFilter === 'FC') return matchesSearch && matchesRole && r.currentStep === 4;
    if (stageFilter === 'ACTIVE') return matchesSearch && matchesRole && r.status === 'ACTIVE';
    if (stageFilter === 'OFFBOARDING') return matchesSearch && matchesRole && r.currentStep === 11;
    return matchesSearch && matchesRole;
  });

  // Actionable Task Count
  const pendingCount = requests.filter(r => matchesRoleFilter(r)).length;

  // Create Request (Step 1)
  const handleCreateRequest = (e) => {
    e.preventDefault();
    const newId = `VMT-2026-00${requests.length + 1}`;
    const newReq = {
      id: newId,
      consultantName: formData.consultantName,
      contactNumber: formData.contactNumber,
      location: formData.location,
      skillRole: formData.skillRole,
      joiningDate: formData.joiningDate,
      partnerName: formData.partnerName,
      portfolioName: formData.portfolioName,
      projectManager: formData.projectManager,
      billingModel: formData.billingModel,
      billingCurrency: formData.billingCurrency,
      baseCost: Number(formData.baseCost),
      markupPercentage: Number(formData.markupPercentage),
      monthlyTotalCost: computedMonthlyCost,
      annualTotalCost: computedAnnualCost,
      priorApprovalRef: formData.priorApprovalRef,
      vendorRemarks: formData.vendorRemarks,
      currentStep: 2, // Moves to Step 2 PM Review
      status: 'PENDING_PM_REVIEW',
      createdAt: new Date().toISOString().split('T')[0],
      documents: ['CV_Attached.pdf', 'Offer_Letter_Rollout.pdf']
    };

    setRequests([newReq, ...requests]);
    addAuditLog(newId, 'VENDOR_SUBMISSION', 'Vendor User', 'Submitted initial consultant request.');
    confetti({ particleCount: 60, spread: 60 });
    setActiveTab('PIPELINE');
    alert(`Request ${newId} submitted successfully! Moved to PM Review queue.`);
  };

  // CSV Download Sample
  const handleDownloadSampleCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8,Consultant Name,Contact,Location,Skill/Role,Joining Date,Billing Model,Base Cost,Markup %\nAarav Sharma,+919876543210,Mumbai,Senior .NET Architect,2026-10-15,HOURLY_TIMESHEET,120000,15\nPriya Sundaram,+919822011223,Bengaluru,Angular Specialist,2026-10-20,FIXED_OPEX,145000,0";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ICICI_Lombard_Vendor_Bulk_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk Upload Processing
  const handleBulkUploadSubmit = () => {
    const bulkRecords = [
      {
        id: `VMT-2026-0${requests.length + 1}`,
        consultantName: 'Karan Mehra',
        contactNumber: '+91 9811223344',
        location: 'Mumbai, Maharashtra',
        skillRole: 'Full Stack .NET/Angular',
        joiningDate: '2026-11-01',
        partnerName: 'TCS Consultancy',
        portfolioName: 'Digital Claims Engine',
        projectManager: 'Vikram Malhotra',
        billingModel: 'HOURLY_TIMESHEET',
        billingCurrency: 'INR',
        baseCost: 110000,
        markupPercentage: 12,
        monthlyTotalCost: 123200,
        annualTotalCost: 1478400,
        currentStep: 2,
        status: 'PENDING_PM_REVIEW',
        createdAt: new Date().toISOString().split('T')[0],
        documents: ['Bulk_Uploaded_CV.pdf']
      },
      {
        id: `VMT-2026-0${requests.length + 2}`,
        consultantName: 'Siddharth Rao',
        contactNumber: '+91 9766554433',
        location: 'Bengaluru, Karnataka',
        skillRole: 'AWS Security Architect',
        joiningDate: '2026-11-05',
        partnerName: 'Infosys Ltd',
        portfolioName: 'Cloud Migration',
        projectManager: 'Ananya Deshmukh',
        billingModel: 'FIXED_CAPEX',
        billingCurrency: 'INR',
        fixedMonthlyRateCard: 175000,
        monthlyTotalCost: 175000,
        annualTotalCost: 2100000,
        currentStep: 2,
        status: 'PENDING_PM_REVIEW',
        createdAt: new Date().toISOString().split('T')[0],
        documents: ['Bulk_Uploaded_CV2.pdf']
      }
    ];

    setRequests([...bulkRecords, ...requests]);
    addAuditLog('BULK-BATCH-01', 'BULK_UPLOAD', 'Vendor User', 'Uploaded 2 consultant records via Excel batch.');
    setShowBulkUpload(false);
    confetti({ particleCount: 80 });
    alert('Bulk upload completed! 2 new requests added to PM Review.');
  };

  // Add Audit Log
  const addAuditLog = (ticketNo, action, performedBy, details) => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      ticketNo,
      action,
      performedBy,
      timestamp: new Date().toLocaleString(),
      details
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  // PM Review Approval (Step 2 -> Step 3)
  const handlePmApprove = () => {
    if (!selectedRequest) return;
    let variance = 0;
    if (pmData.hiringType === 'REPLACEMENT') {
      variance = selectedRequest.monthlyTotalCost - Number(pmData.previousRateCard);
    }

    const updated = requests.map(r => {
      if (r.id === selectedRequest.id) {
        return {
          ...r,
          hiringType: pmData.hiringType,
          reasonForHiring: pmData.reasonForHiring,
          justification: pmData.justification,
          previousConsultantIlomId: pmData.previousConsultantIlomId,
          previousConsultantName: pmData.previousConsultantName,
          previousRateCard: Number(pmData.previousRateCard),
          costVariance: variance,
          currentStep: 3, // Moves to VP Approval
          status: 'PENDING_VP_APPROVAL'
        };
      }
      return r;
    });

    setRequests(updated);
    addAuditLog(selectedRequest.id, 'PM_APPROVAL', 'Vikram Malhotra (PM)', `Approved profile. Replacement Variance: ₹${variance}`);
    setShowModal(false);
    alert(`Profile approved by PM! Forwarded to VP Approval stage.`);
  };

  // VP Approval (Step 3 -> Step 4)
  const handleVpApprove = () => {
    if (!selectedRequest) return;
    const updated = requests.map(r => {
      if (r.id === selectedRequest.id) {
        return {
          ...r,
          currentStep: 4, // Moves to Financial Controller
          status: 'PENDING_FC_REVIEW'
        };
      }
      return r;
    });

    setRequests(updated);
    addAuditLog(selectedRequest.id, 'VP_APPROVAL', 'Arif Merchant (VP)', 'DFP Adherence verified. Approved for FC Review.');
    setShowModal(false);
    alert('VP DFP Approval completed! Forwarded to Financial Controller queue.');
  };

  // FC Review Approval (Step 4 -> Step 5 Hardware Auto Trigger)
  const handleFcApprove = () => {
    if (!selectedRequest) return;
    const updated = requests.map(r => {
      if (r.id === selectedRequest.id) {
        return {
          ...r,
          costCenterCode: fcCostCenter,
          costCenterDescription: 'Allocated Cost Center',
          currentStep: 6, // Hardware triggered -> Moves to Onboarding
          status: 'PENDING_ONBOARDING_DOCS'
        };
      }
      return r;
    });

    setRequests(updated);
    addAuditLog(selectedRequest.id, 'FC_APPROVAL', 'Rajeev Singhania (FC)', `Assigned Cost Center ${fcCostCenter}. Triggered Hardware allocation.`);
    setShowModal(false);
    alert(`Financial Controller approved! Cost Center ${fcCostCenter} assigned. Hardware request auto-triggered.`);
  };

  // Pushback Handler
  const handlePushback = (targetStep) => {
    if (!selectedRequest) return;
    let targetStatus = 'PENDING_VENDOR_INPUT';
    if (targetStep === 2) targetStatus = 'PUSHBACK_TO_PM';

    const updated = requests.map(r => {
      if (r.id === selectedRequest.id) {
        return {
          ...r,
          currentStep: targetStep,
          status: targetStatus,
          isPushedBack: true
        };
      }
      return r;
    });

    setRequests(updated);
    addAuditLog(selectedRequest.id, 'PUSHBACK', `${currentRole} User`, `Pushed back request to Step ${targetStep}.`);
    setShowModal(false);
    alert(`Request pushed back to Step ${targetStep} successfully.`);
  };

  // Instant Reject Handler
  const handleReject = () => {
    if (!selectedRequest) return;
    const updated = requests.map(r => {
      if (r.id === selectedRequest.id) {
        return {
          ...r,
          currentStep: 99,
          status: 'REJECTED'
        };
      }
      return r;
    });

    setRequests(updated);
    addAuditLog(selectedRequest.id, 'REJECTED', `${currentRole} User`, 'Request fully rejected.');
    setShowModal(false);
    alert('Request rejected.');
  };

  // Step 6 Onboarding Submit
  const handleOnboardingSubmit = () => {
    if (!selectedRequest) return;
    const updated = requests.map(r => {
      if (r.id === selectedRequest.id) {
        return {
          ...r,
          vendorPayrollId: onboardingForm.vendorPayrollId || 'PAY-88301',
          actualJoiningDate: onboardingForm.actualJoiningDate || new Date().toISOString().split('T')[0],
          panNumber: onboardingForm.panNumber || 'ABCDE1234F',
          currentStep: 8, // Moves to AD Creation
          status: 'PENDING_AD_CREATION'
        };
      }
      return r;
    });

    setRequests(updated);
    addAuditLog(selectedRequest.id, 'ONBOARDING_CONFIRMED', 'Vendor User', 'Confirmed actual joining date and uploaded PAN & Offer proofs.');
    setShowModal(false);
    alert('Onboarding confirmation submitted! Triggered AD ID creation request.');
  };

  // Step 8 AD Team ILOM ID Update
  const handleAdIlomUpdate = () => {
    if (!selectedRequest || !ilomInput) {
      alert('Please enter an ILOM ID!');
      return;
    }

    const updated = requests.map(r => {
      if (r.id === selectedRequest.id) {
        return {
          ...r,
          ilomId: ilomInput,
          currentStep: 10, // Moves to Active / Kairos Auto Created
          status: 'ACTIVE'
        };
      }
      return r;
    });

    setRequests(updated);
    addAuditLog(selectedRequest.id, 'AD_ILOM_ASSIGNED', 'AD Support Team', `Assigned official ILOM ID: ${ilomInput}. Auto-created ID in Kairos.`);
    setShowModal(false);
    confetti({ particleCount: 70, spread: 70 });
    alert(`ILOM ID ${ilomInput} assigned! Kairos ID auto-created. Consultant is now ACTIVE!`);
  };

  // Step 10 Rate Amendment Submit
  const handleAddendumSubmit = (e) => {
    e.preventDefault();
    const updated = requests.map(r => {
      if (r.id === rateAmendmentForm.consultantId) {
        return {
          ...r,
          monthlyTotalCost: Number(rateAmendmentForm.newRate),
          annualTotalCost: Number(rateAmendmentForm.newRate) * 12,
          hasActiveAddendum: true
        };
      }
      return r;
    });

    setRequests(updated);
    addAuditLog(rateAmendmentForm.consultantId, 'RATE_AMENDMENT', `${rateAmendmentForm.initiatedBy}`, `Updated rate card to ₹${rateAmendmentForm.newRate}. Reason: ${rateAmendmentForm.reason}`);
    confetti({ particleCount: 50 });
    alert('Rate Amendment request approved and applied to Kairos!');
  };

  // Step 11 Offboarding Trigger
  const handleOffboardingTrigger = (reqId) => {
    const updated = requests.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          currentStep: 11,
          status: 'OFFBOARDING_INITIATED',
          adRevoked: true,
          assetReturned: true,
          timesheetSubmitted: true
        };
      }
      return r;
    });

    setRequests(updated);
    addAuditLog(reqId, 'OFFBOARDING_INITIATED', `${currentRole} User`, 'Triggered AD access deletion, asset return, and final timesheet submission.');
    alert('Offboarding process initiated. Access & Asset revocation requests sent.');
  };

  // Final FC Closure for Offboarding
  const handleFcOffboardingClose = (reqId) => {
    const updated = requests.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          currentStep: 12,
          status: 'INACTIVE',
          lastWorkingDay: new Date().toISOString().split('T')[0]
        };
      }
      return r;
    });

    setRequests(updated);
    addAuditLog(reqId, 'OFFBOARDING_CLOSED', 'Financial Controller', 'Approved final financial closure. Candidate marked INACTIVE.');
    alert('Financial Controller closed offboarding. Consultant marked INACTIVE.');
  };

  // Step Badge Helper
  const getStepBadge = (step, status) => {
    if (status === 'REJECTED') return <span className="badge badge-rose">Rejected</span>;
    if (status === 'ACTIVE') return <span className="badge badge-green">Active (Kairos Synced)</span>;
    if (status === 'INACTIVE') return <span className="badge badge-purple">Inactive (Offboarded)</span>;
    
    switch(step) {
      case 1: return <span className="badge badge-amber">Step 1: Vendor Input</span>;
      case 2: return <span className="badge badge-amber">Step 2: PM Review</span>;
      case 3: return <span className="badge badge-cyan">Step 3: VP Approval</span>;
      case 4: return <span className="badge badge-purple">Step 4: FC Review</span>;
      case 5: return <span className="badge badge-blue">Step 5: Hardware Triggered</span>;
      case 6: return <span className="badge badge-amber">Step 6: Onboarding Docs</span>;
      case 7: 
      case 8: return <span className="badge badge-cyan">Step 8: AD ILOM Sync</span>;
      case 10: return <span className="badge badge-green">Step 10: Active / Addendum</span>;
      case 11: return <span className="badge badge-rose">Step 11: Offboarding Initiated</span>;
      default: return <span className="badge badge-blue">In Progress</span>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* TOP HEADER */}
      <header className="glass-panel" style={{ borderRadius: 0, padding: '0.85rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #F37021, #003366)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
            IL
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0 }}>ICICI Lombard</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--brand-orange)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Vendor Management Tool (VMT)</p>
          </div>
        </div>

        {/* ACTIVE ROLE SWITCHER & BADGE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(243, 112, 33, 0.15)', padding: '0.4rem 0.85rem', borderRadius: '20px', border: '1px solid rgba(243, 112, 33, 0.3)' }}>
            <Sparkles size={16} style={{ color: 'var(--brand-orange)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-orange)' }}>
              {pendingCount} Pending Action(s) for {currentRole}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-surface)', padding: '0.4rem 1rem', borderRadius: '30px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>SWITCH ROLE:</span>
            <select 
              value={currentRole} 
              onChange={(e) => setCurrentRole(e.target.value)}
              style={{ background: 'transparent', color: 'var(--brand-orange)', border: 'none', fontWeight: 700, outline: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              <option value="VENDOR">🏢 Vendor Partner (Input & Addendum)</option>
              <option value="PM">👨‍💼 Portfolio Manager (Step 2 PM)</option>
              <option value="VP">🛡️ VP Approval (Step 3 DFP)</option>
              <option value="FC">💰 Financial Controller (Step 4 FC)</option>
              <option value="HARDWARE">💻 Asset / Hardware Team (Step 5)</option>
              <option value="AD_TEAM">🆔 AD Access Team (Step 8 ILOM)</option>
              <option value="ADMIN">⚙️ System Administrator / Kairos</option>
            </select>
          </div>
        </div>
      </header>

      {/* DYNAMIC ROLE BANNER */}
      <div style={{ background: 'linear-gradient(90deg, #1C2541, #0B132B)', padding: '0.75rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.4rem' }}>{roleConfig[currentRole]?.icon}</span>
          <div>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-main)', margin: 0 }}>{roleConfig[currentRole]?.title} Active View</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{roleConfig[currentRole]?.desc}</p>
          </div>
        </div>

        <button 
          className={`btn ${filterByRoleOnly ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterByRoleOnly(!filterByRoleOnly)}
          style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
        >
          {filterByRoleOnly ? '🎯 Role View Only (Filtered)' : '🌐 System Wide View (All Tasks)'}
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <div style={{ display: 'flex', flex: 1 }}>
        
        {/* SIDEBAR NAVIGATION */}
        <aside style={{ width: '250px', background: 'var(--bg-card)', borderRight: '1px solid var(--border-color)', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          
          <button 
            className={`btn ${activeTab === 'DASHBOARD' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setActiveTab('DASHBOARD')}
            style={{ justifyContent: 'flex-start' }}
          >
            <Layers size={18} /> Executive Dashboard
          </button>

          <button 
            className={`btn ${activeTab === 'NEW_REQUEST' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setActiveTab('NEW_REQUEST')}
            style={{ justifyContent: 'flex-start' }}
          >
            <PlusCircle size={18} /> Step 1: New Request
          </button>

          <button 
            className={`btn ${activeTab === 'PIPELINE' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setActiveTab('PIPELINE')}
            style={{ justifyContent: 'flex-start' }}
          >
            <ArrowLeftRight size={18} /> Requests Pipeline ({filteredRequests.length})
          </button>

          <button 
            className={`btn ${activeTab === 'RATE_AMENDMENT' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setActiveTab('RATE_AMENDMENT')}
            style={{ justifyContent: 'flex-start' }}
          >
            <RefreshCw size={18} /> Step 10: Rate Amendments
          </button>

          <button 
            className={`btn ${activeTab === 'OFFBOARDING' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setActiveTab('OFFBOARDING')}
            style={{ justifyContent: 'flex-start' }}
          >
            <LogOut size={18} /> Step 11: Offboarding
          </button>

          <button 
            className={`btn ${activeTab === 'REPORTS' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setActiveTab('REPORTS')}
            style={{ justifyContent: 'flex-start' }}
          >
            <FileSpreadsheet size={18} /> Reports & Audit Logs
          </button>

          <div style={{ marginTop: 'auto', background: 'rgba(243, 112, 33, 0.08)', padding: '1rem', borderRadius: '10px', border: '1px dashed rgba(243, 112, 33, 0.3)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role Adaptability:</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>Switching roles above immediately updates your pipeline, actionable task counts, and drawer approval forms!</p>
          </div>
        </aside>

        {/* MAIN BODY AREA */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>

          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === 'DASHBOARD' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Executive Overview</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real-time vendor consultant pipeline metrics across ICICI Lombard.</p>
                </div>
              </div>

              {/* STATS CARDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--brand-orange)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL SYSTEM REQUESTS</span>
                  <h3 style={{ fontSize: '2rem', color: 'var(--text-main)', margin: '0.3rem 0' }}>{requests.length}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>Active in workflow</span>
                </div>

                <div className="card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>YOUR ROLE ACTIONABLE TASKS</span>
                  <h3 style={{ fontSize: '2rem', color: 'var(--brand-orange)', margin: '0.3rem 0' }}>{pendingCount}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)' }}>Requires {currentRole} action</span>
                </div>

                <div className="card" style={{ borderLeft: '4px solid var(--accent-green)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE CONSULTANTS</span>
                  <h3 style={{ fontSize: '2rem', color: 'var(--text-main)', margin: '0.3rem 0' }}>
                    {requests.filter(r => r.status === 'ACTIVE').length}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>Synced with Kairos</span>
                </div>

                <div className="card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL MONTHLY SPEND</span>
                  <h3 style={{ fontSize: '1.6rem', color: 'var(--text-main)', margin: '0.3rem 0' }}>
                    ₹{(requests.reduce((acc, curr) => acc + (curr.monthlyTotalCost || 0), 0) / 100000).toFixed(2)} Lakhs
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>Monthly vendor payout</span>
                </div>
              </div>

              {/* RECENT PIPELINE SUMMARY */}
              <div className="card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Recent Vendor Requests ({currentRole} View)</h3>
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Consultant Name</th>
                        <th>Partner</th>
                        <th>Portfolio / PM</th>
                        <th>Monthly Cost</th>
                        <th>Stage</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.slice(0, 5).map(req => (
                        <tr key={req.id}>
                          <td style={{ fontWeight: 600, color: 'var(--brand-orange)' }}>{req.id}</td>
                          <td>{req.consultantName}</td>
                          <td>{req.partnerName}</td>
                          <td>{req.projectManager}</td>
                          <td style={{ fontWeight: 600 }}>₹{req.monthlyTotalCost?.toLocaleString()}</td>
                          <td>{getStepBadge(req.currentStep, req.status)}</td>
                          <td>
                            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={() => { setSelectedRequest(req); setShowModal(true); }}>
                              <Eye size={14} /> Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STEP 1 NEW VENDOR REQUEST */}
          {activeTab === 'NEW_REQUEST' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Step 1: Vendor Inputs Request</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enter consultant details and billing rate model.</p>
                </div>
                <button className="btn btn-secondary" onClick={() => setShowBulkUpload(true)}>
                  <FileSpreadsheet size={16} /> Bulk Upload (Excel / CSV)
                </button>
              </div>

              <form onSubmit={handleCreateRequest} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                
                <div className="form-group">
                  <label className="form-label">Consultant Full Name *</label>
                  <input className="form-input" required value={formData.consultantName} onChange={(e) => setFormData({...formData, consultantName: e.target.value})} placeholder="Enter full legal name" />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Number (Optional)</label>
                  <input className="form-input" value={formData.contactNumber} onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} placeholder="+91 XXXXXXXXXX" />
                </div>

                <div className="form-group">
                  <label className="form-label">Deployment Location *</label>
                  <input className="form-input" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="City, State" />
                </div>

                <div className="form-group">
                  <label className="form-label">Skill / Role *</label>
                  <input className="form-input" required value={formData.skillRole} onChange={(e) => setFormData({...formData, skillRole: e.target.value})} placeholder="e.g. Senior .NET / Angular Architect" />
                </div>

                <div className="form-group">
                  <label className="form-label">Joining Date (Tentative) *</label>
                  <input type="date" className="form-input" required value={formData.joiningDate} onChange={(e) => setFormData({...formData, joiningDate: e.target.value})} />
                </div>

                <div className="form-group">
                  <label className="form-label">Partner Name (Auto-populated)</label>
                  <input className="form-input" readonly value={formData.partnerName} />
                </div>

                <div className="form-group">
                  <label className="form-label">Portfolio / Project Name *</label>
                  <input className="form-input" required value={formData.portfolioName} onChange={(e) => setFormData({...formData, portfolioName: e.target.value})} />
                </div>

                <div className="form-group">
                  <label className="form-label">Portfolio Manager (PM Approval Flow) *</label>
                  <select className="form-select" value={formData.projectManager} onChange={(e) => setFormData({...formData, projectManager: e.target.value})}>
                    <option value="Vikram Malhotra">Vikram Malhotra (Claims Engine)</option>
                    <option value="Ananya Deshmukh">Ananya Deshmukh (Digital Mobility)</option>
                    <option value="Rajesh Gupta">Rajesh Gupta (Core Analytics)</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Billing Model *</label>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.3rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="radio" name="billingModel" value="HOURLY_TIMESHEET" checked={formData.billingModel === 'HOURLY_TIMESHEET'} onChange={(e) => setFormData({...formData, billingModel: e.target.value})} />
                      Hourly / Timesheet Based
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="radio" name="billingModel" value="FIXED_CAPEX" checked={formData.billingModel === 'FIXED_CAPEX'} onChange={(e) => setFormData({...formData, billingModel: e.target.value})} />
                      Fixed CF (Capex)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="radio" name="billingModel" value="FIXED_OPEX" checked={formData.billingModel === 'FIXED_OPEX'} onChange={(e) => setFormData({...formData, billingModel: e.target.value})} />
                      Fixed Contract (Opex)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="radio" name="billingModel" value="FIXED_PAYOUT_MONTHLY" checked={formData.billingModel === 'FIXED_PAYOUT_MONTHLY'} onChange={(e) => setFormData({...formData, billingModel: e.target.value})} />
                      Fixed Monthly Payout
                    </label>
                  </div>
                </div>

                {formData.billingModel === 'HOURLY_TIMESHEET' ? (
                  <>
                    <div className="form-group">
                      <label className="form-label">Base Cost (INR / Month)</label>
                      <input type="number" className="form-input" value={formData.baseCost} onChange={(e) => setFormData({...formData, baseCost: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Markup %</label>
                      <input type="number" className="form-input" value={formData.markupPercentage} onChange={(e) => setFormData({...formData, markupPercentage: e.target.value})} />
                    </div>
                  </>
                ) : (
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Fixed Cost Rate Card (Monthly INR)</label>
                    <input type="number" className="form-input" value={formData.fixedMonthlyRateCard} onChange={(e) => setFormData({...formData, fixedMonthlyRateCard: e.target.value})} />
                  </div>
                )}

                {/* CALCULATED READONLY SUMMARY */}
                <div style={{ gridColumn: 'span 2', background: 'rgba(28, 37, 65, 0.9)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL MONTHLY COST</span>
                    <h4 style={{ fontSize: '1.4rem', color: 'var(--brand-orange)' }}>₹{computedMonthlyCost.toLocaleString()}</h4>
                  </div>
                  <div style={{ height: '30px', borderRight: '1px solid var(--border-color)' }}></div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL ANNUAL COST (X 12)</span>
                    <h4 style={{ fontSize: '1.4rem', color: 'var(--accent-green)' }}>₹{computedAnnualCost.toLocaleString()}</h4>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Prior Approval / Reference ID</label>
                  <input className="form-input" value={formData.priorApprovalRef} onChange={(e) => setFormData({...formData, priorApprovalRef: e.target.value})} placeholder="e.g. EMAIL-REF-99182" />
                </div>

                <div className="form-group">
                  <label className="form-label">Upload CV & Offer Letter</label>
                  <input type="file" className="form-input" />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Vendor Remarks</label>
                  <textarea className="form-textarea" rows={2} value={formData.vendorRemarks} onChange={(e) => setFormData({...formData, vendorRemarks: e.target.value})} placeholder="Optional remarks for Portfolio Manager..." />
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                    <PlusCircle size={18} /> Submit Request for PM Review
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* TAB 3: PIPELINE QUEUE */}
          {activeTab === 'PIPELINE' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Requests Pipeline ({currentRole} View)</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Showing {filteredRequests.length} candidate applications for {currentRole}.</p>
                </div>

                {/* SEARCH & STAGE FILTER BAR */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Search consultant or ticket..." 
                      style={{ paddingLeft: '2rem', width: '220px' }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <select className="form-select" value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
                    <option value="ALL">All Stages</option>
                    <option value="PM">Step 2: PM Review</option>
                    <option value="VP">Step 3: VP Approval</option>
                    <option value="FC">Step 4: FC Review</option>
                    <option value="ACTIVE">Step 10: Active Consultants</option>
                    <option value="OFFBOARDING">Step 11: Exit Initiated</option>
                  </select>
                </div>
              </div>

              <div className="card">
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Consultant Name</th>
                        <th>Skill / Role</th>
                        <th>Portfolio / PM</th>
                        <th>Monthly Cost</th>
                        <th>Current Stage</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map(req => (
                        <tr key={req.id}>
                          <td style={{ fontWeight: 600, color: 'var(--brand-orange)' }}>{req.id}</td>
                          <td style={{ fontWeight: 600 }}>{req.consultantName}</td>
                          <td>{req.skillRole}</td>
                          <td>{req.projectManager}</td>
                          <td style={{ fontWeight: 600 }}>₹{req.monthlyTotalCost?.toLocaleString()}</td>
                          <td>{getStepBadge(req.currentStep, req.status)}</td>
                          <td>
                            <button className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={() => { setSelectedRequest(req); setShowModal(true); }}>
                              <Eye size={14} /> Open Workflow Drawer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STEP 10 RATE AMENDMENTS */}
          {activeTab === 'RATE_AMENDMENT' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Step 10: Rate Amendment / Addendum Flow</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage mid-contract rate card changes and appraisal addendums.</p>
              </div>

              <div className="card" style={{ maxWidth: '700px' }}>
                <form onSubmit={handleAddendumSubmit}>
                  
                  <div className="form-group">
                    <label className="form-label">Initiator Type</label>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.3rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="radio" name="initType" value="VENDOR" checked={rateAmendmentForm.initiatedBy === 'VENDOR'} onChange={(e) => setRateAmendmentForm({...rateAmendmentForm, initiatedBy: e.target.value})} />
                        Option 1: Vendor Upload Request
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="radio" name="initType" value="LOMBARD_FINANCE" checked={rateAmendmentForm.initiatedBy === 'LOMBARD_FINANCE'} onChange={(e) => setRateAmendmentForm({...rateAmendmentForm, initiatedBy: e.target.value})} />
                        Option 2: Lombard Finance (Appraisal)
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Select Active Consultant *</label>
                    <select className="form-select" required value={rateAmendmentForm.consultantId} onChange={(e) => setRateAmendmentForm({...rateAmendmentForm, consultantId: e.target.value})}>
                      <option value="">-- Choose Consultant --</option>
                      {requests.filter(r => r.status === 'ACTIVE').map(c => (
                        <option key={c.id} value={c.id}>{c.consultantName} ({c.ilomId}) - Current: ₹{c.monthlyTotalCost}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Monthly Rate Card (INR) *</label>
                    <input type="number" className="form-input" required value={rateAmendmentForm.newRate} onChange={(e) => setRateAmendmentForm({...rateAmendmentForm, newRate: e.target.value})} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Reason for Rate Revision *</label>
                    <textarea className="form-textarea" rows={3} required value={rateAmendmentForm.reason} onChange={(e) => setRateAmendmentForm({...rateAmendmentForm, reason: e.target.value})} placeholder="e.g. Annual performance appraisal or scope expansion..." />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    <RefreshCw size={16} /> Submit Addendum & Apply to Kairos
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: STEP 11 OFFBOARDING */}
          {activeTab === 'OFFBOARDING' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Step 11: Offboarding Process</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Initiate exits, access deletion, asset returns, and FC closure.</p>
              </div>

              <div className="card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Active Consultants Eligible for Exit</h3>
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Consultant Name</th>
                        <th>ILOM ID</th>
                        <th>Partner</th>
                        <th>Current Status</th>
                        <th>AD Access</th>
                        <th>Hardware Asset</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.filter(r => ['ACTIVE', 'OFFBOARDING_INITIATED'].includes(r.status)).map(req => (
                        <tr key={req.id}>
                          <td style={{ fontWeight: 600 }}>{req.consultantName}</td>
                          <td style={{ color: 'var(--accent-cyan)' }}>{req.ilomId || 'ILOM-TEMP-01'}</td>
                          <td>{req.partnerName}</td>
                          <td>{getStepBadge(req.currentStep, req.status)}</td>
                          <td>{req.adRevoked ? <span style={{ color: 'var(--accent-rose)' }}>Revoked</span> : <span style={{ color: 'var(--accent-green)' }}>Active</span>}</td>
                          <td>{req.assetReturned ? <span style={{ color: 'var(--accent-green)' }}>Returned</span> : <span style={{ color: 'var(--accent-amber)' }}>Allocated</span>}</td>
                          <td>
                            {req.status === 'ACTIVE' ? (
                              <button className="btn btn-danger" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={() => handleOffboardingTrigger(req.id)}>
                                Initiate Exit Request
                              </button>
                            ) : (
                              <button className="btn btn-success" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={() => handleFcOffboardingClose(req.id)}>
                                FC Final Closure Approval
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: REPORTS & AUDIT LOGS */}
          {activeTab === 'REPORTS' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Reports & Audit Trail</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Complete historical compliance logs and consultant inventory.</p>
              </div>

              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--brand-orange)' }}>Audit Timeline Logs</h3>
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Log ID</th>
                        <th>Ticket No</th>
                        <th>Action</th>
                        <th>Performed By</th>
                        <th>Timestamp</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map(log => (
                        <tr key={log.id}>
                          <td style={{ color: 'var(--text-muted)' }}>{log.id}</td>
                          <td style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{log.ticketNo}</td>
                          <td><span className="badge badge-blue">{log.action}</span></td>
                          <td>{log.performedBy}</td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.timestamp}</td>
                          <td>{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 11-STEP WORKFLOW INTERACTIVE MODAL */}
      {showModal && selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-content">
            
            {/* MODAL HEADER */}
            <div style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0 }}>
                  Candidate Workflow: {selectedRequest.consultantName}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--brand-orange)', margin: 0 }}>Ticket #{selectedRequest.id} | Partner: {selectedRequest.partnerName}</p>
              </div>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ padding: '0.35rem 0.75rem' }}>✕ Close</button>
            </div>

            {/* STEPPER PROGRESS */}
            <div style={{ padding: '1rem 1.5rem', background: 'rgba(15, 23, 42, 0.5)', borderBottom: '1px solid var(--border-color)' }}>
              <div className="stepper-container">
                {[
                  { num: 1, label: '1. Vendor' },
                  { num: 2, label: '2. PM' },
                  { num: 3, label: '3. VP DFP' },
                  { num: 4, label: '4. FC Review' },
                  { num: 5, label: '5. Asset' },
                  { num: 6, label: '6. Onboarding' },
                  { num: 8, label: '8. AD ILOM' },
                  { num: 9, label: '9. Kairos' },
                  { num: 10, label: '10. Active' },
                  { num: 11, label: '11. Exit' }
                ].map((s) => {
                  const isCompleted = selectedRequest.currentStep > s.num;
                  const isCurrent = selectedRequest.currentStep === s.num;
                  return (
                    <div key={s.num} className={`stepper-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                      <div className="stepper-circle">{isCompleted ? '✓' : s.num}</div>
                      <span className="stepper-label">{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MODAL BODY */}
            <div style={{ padding: '1.5rem', overflowY: 'auto' }}>

              {/* STEP 1 SUMMARY VIEW */}
              <div style={{ marginBottom: '1.5rem', background: 'var(--bg-surface)', padding: '1rem', borderRadius: '10px' }}>
                <h4 style={{ color: 'var(--brand-orange)', marginBottom: '0.75rem' }}>Step 1: Vendor Submitted Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Location:</span> {selectedRequest.location}</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Skill / Role:</span> {selectedRequest.skillRole}</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Billing Model:</span> {selectedRequest.billingModel}</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Monthly CTC:</span> ₹{selectedRequest.monthlyTotalCost?.toLocaleString()}</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Annual CTC:</span> ₹{selectedRequest.annualTotalCost?.toLocaleString()}</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Prior Approval Ref:</span> {selectedRequest.priorApprovalRef || 'None'}</div>
                </div>
              </div>

              {/* ROLE SPECIFIC INTERACTIVE STAGES */}

              {/* STEP 2 PM REVIEW INTERACTION */}
              {selectedRequest.currentStep === 2 && (
                <div style={{ border: '1px solid var(--accent-amber)', padding: '1.25rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.05)', marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--accent-amber)', marginBottom: '1rem' }}>Step 2: Portfolio Manager Review & Requirement Addition</h4>
                  
                  <div className="form-group">
                    <label className="form-label">Type of Hiring *</label>
                    <select className="form-select" value={pmData.hiringType} onChange={(e) => setPmData({...pmData, hiringType: e.target.value})}>
                      <option value="NEW_CONSULTANT">New Consultant (Budgeted)</option>
                      <option value="REPLACEMENT">Replacement of Previous Candidate</option>
                    </select>
                  </div>

                  {pmData.hiringType === 'REPLACEMENT' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">ILOM ID of Previous Candidate</label>
                        <input className="form-input" value={pmData.previousConsultantIlomId} onChange={(e) => setPmData({...pmData, previousConsultantIlomId: e.target.value})} placeholder="e.g. ILOM-9921" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Previous Candidate Name</label>
                        <input className="form-input" value={pmData.previousConsultantName} onChange={(e) => setPmData({...pmData, previousConsultantName: e.target.value})} placeholder="Name" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Previous Candidate Monthly Rate Card (INR)</label>
                        <input type="number" className="form-input" value={pmData.previousRateCard} onChange={(e) => setPmData({...pmData, previousRateCard: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Calculated Savings / (Excess)</label>
                        <input className="form-input" readonly value={`₹${(selectedRequest.monthlyTotalCost - Number(pmData.previousRateCard)).toLocaleString()}`} />
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Reason for Hiring / Justification</label>
                    <textarea className="form-textarea" rows={2} value={pmData.justification} onChange={(e) => setPmData({...pmData, justification: e.target.value})} />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button className="btn btn-success" onClick={handlePmApprove} style={{ flex: 1 }}>
                      <CheckCircle2 size={16} /> PM Approve (Send to VP)
                    </button>
                    <button className="btn btn-warning" onClick={() => handlePushback(1)}>
                      Pushback to Vendor
                    </button>
                    <button className="btn btn-danger" onClick={handleReject}>
                      <XCircle size={16} /> Instant Reject
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 VP APPROVAL INTERACTION */}
              {selectedRequest.currentStep === 3 && (
                <div style={{ border: '1px solid var(--accent-cyan)', padding: '1.25rem', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.05)', marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>Step 3: VP Approval for Adherence to DFP</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Review all attachments, replacement variance, and budget limits.</p>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-success" onClick={handleVpApprove} style={{ flex: 1 }}>
                      <CheckCircle2 size={16} /> VP DFP Approve (Send to FC)
                    </button>
                    <button className="btn btn-warning" onClick={() => handlePushback(2)}>
                      Pushback to PM
                    </button>
                    <button className="btn btn-danger" onClick={handleReject}>
                      Fully Reject
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4 FINANCIAL CONTROLLER REVIEW INTERACTION */}
              {selectedRequest.currentStep === 4 && (
                <div style={{ border: '1px solid var(--accent-purple)', padding: '1.25rem', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.05)', marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--accent-purple)', marginBottom: '1rem' }}>Step 4: Financial Controller Review & Cost Centre Allocation</h4>
                  
                  <div className="form-group">
                    <label className="form-label">Assign Cost Centre Code *</label>
                    <select className="form-select" value={fcCostCenter} onChange={(e) => setFcCostCenter(e.target.value)}>
                      <option value="CC-MUM-IT-402">CC-MUM-IT-402 (IT Infrastructure & Cloud Ops)</option>
                      <option value="CC-BLR-DEV-101">CC-BLR-DEV-101 (Digital Engineering Solutions)</option>
                      <option value="CC-PUN-CLOUD-909">CC-PUN-CLOUD-909 (Cloud Enterprise Security)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button className="btn btn-success" onClick={handleFcApprove} style={{ flex: 1 }}>
                      <CheckCircle2 size={16} /> FC Approve & Trigger Hardware
                    </button>
                    <button className="btn btn-warning" onClick={() => handlePushback(3)}>
                      Pushback to VP
                    </button>
                    <button className="btn btn-danger" onClick={handleReject}>
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6 ONBOARDING CONFIRMATION INTERACTION */}
              {selectedRequest.currentStep === 6 && (
                <div style={{ border: '1px solid var(--accent-amber)', padding: '1.25rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.05)', marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--accent-amber)', marginBottom: '1rem' }}>Step 6: Vendor Onboarding Confirmation & PAN Upload</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Consultant ID in Vendor's Payroll *</label>
                      <input className="form-input" value={onboardingForm.vendorPayrollId} onChange={(e) => setOnboardingForm({...onboardingForm, vendorPayrollId: e.target.value})} placeholder="e.g. TCS-EMP-9912" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm Actual Joining Date *</label>
                      <input type="date" className="form-input" value={onboardingForm.actualJoiningDate} onChange={(e) => setOnboardingForm({...onboardingForm, actualJoiningDate: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Candidate PAN Number *</label>
                      <input className="form-input" value={onboardingForm.panNumber} onChange={(e) => setOnboardingForm({...onboardingForm, panNumber: e.target.value})} placeholder="10 Digit PAN" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Upload Proof of Joining (PAN / Offer Letter)</label>
                      <input type="file" className="form-input" />
                    </div>
                  </div>

                  <button className="btn btn-success" onClick={handleOnboardingSubmit} style={{ width: '100%', marginTop: '1rem' }}>
                    Confirm Onboarding & Trigger AD ID Creation
                  </button>
                </div>
              )}

              {/* STEP 8 AD TEAM REVERSE SHARE ILOM ID */}
              {selectedRequest.currentStep === 8 && (
                <div style={{ border: '1px solid var(--accent-cyan)', padding: '1.25rem', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.05)', marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>Step 8: AD Team Reverse Share ILOM ID</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Active Directory team inputs official ILOM ID to trigger Kairos sync.</p>
                  
                  <div className="form-group">
                    <label className="form-label">Generated ILOM ID *</label>
                    <input className="form-input" value={ilomInput} onChange={(e) => setIlomInput(e.target.value)} placeholder="e.g. ILOM-992144" />
                  </div>

                  <button className="btn btn-primary" onClick={handleAdIlomUpdate} style={{ width: '100%', marginTop: '1rem' }}>
                    Assign ILOM ID & Auto Create in Kairos
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* BULK UPLOAD MODAL */}
      {showBulkUpload && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Bulk Upload Vendor Requests (Excel / CSV)</h3>
              <button className="btn btn-secondary" onClick={() => setShowBulkUpload(false)}>✕</button>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Upload multiple consultant profiles at once using the standard Excel template.
              </p>

              <div style={{ border: '2px dashed var(--border-color)', padding: '2rem', borderRadius: '10px', textAlign: 'center', marginBottom: '1.5rem', background: 'var(--bg-surface)' }}>
                <Upload size={32} style={{ color: 'var(--brand-orange)', marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Drag & Drop Excel / CSV File (.xlsx, .csv)</p>
                <input type="file" style={{ marginTop: '0.5rem' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }} onClick={handleDownloadSampleCsv}>
                  <Download size={14} /> Download Sample CSV Template
                </button>
                <button className="btn btn-primary" onClick={handleBulkUploadSubmit}>
                  Process Bulk Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
