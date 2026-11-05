export type DeviceRef = {
  label: string;
  slug: string;
};

export type Scenario = {
  title: string;
  situation: string;
  workflow: string[];
  devices: DeviceRef[];
  outcomes: string[];
  note?: string;
};

export type Industry = {
  id: string;
  index: string;
  eyebrow: string;
  name: string;
  intro: string;
  scenarios: Scenario[];
};

export type SolutionLayer = {
  num: string;
  title: string;
  body: string;
  tags: string[];
};

export type SpecializedWorkflow = {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  devices: DeviceRef[];
};

const HT400: DeviceRef = { label: 'HT400 Barcode PDA', slug: 'ht400-rugged-barcode-pda' };
const HT510: DeviceRef = { label: 'HT510 Rugged PDA', slug: 'ht510-rugged-pda' };
const HT520: DeviceRef = { label: 'HT520 Multifunction PDA', slug: 'ht520-multifunction-pda' };
const HT530: DeviceRef = { label: 'HT530 ID Capture PDA', slug: 'ht530-document-id-pda' };
const HT540: DeviceRef = { label: 'HT540 RFID Handheld', slug: 'ht540-rfid-handheld' };
const HT550: DeviceRef = { label: 'HT550 UHF RFID', slug: 'ht550-uhf-rfid-handheld' };
const HT800: DeviceRef = { label: 'HT800 Scan & Print', slug: 'ht800-scan-print-pda' };
const Y70: DeviceRef = { label: 'Y70 7-inch Tablet', slug: 'y70-rugged-tablet' };
const Y100: DeviceRef = { label: 'Y100 Android Tablet', slug: 'y100-rugged-android-tablet' };
const Y100RFID: DeviceRef = { label: 'Y100 RFID Tablet', slug: 'y100-uhf-rfid-tablet' };
const A100: DeviceRef = { label: 'A100 Windows Tablet', slug: 'a100-windows-rugged-tablet' };

export const solutionLayers: SolutionLayer[] = [
  {
    num: '01',
    title: 'Capture',
    body: 'Match the capture method to speed, range and item type. A barcode is precise; UHF RFID is fast in bulk.',
    tags: ['1D / 2D barcode', 'UHF RFID', 'NFC', 'ID / document']
  },
  {
    num: '02',
    title: 'Compute',
    body: 'Choose a handheld for one-handed tasks, or a tablet for larger screens, Windows software and equipment I/O.',
    tags: ['Rugged PDA', 'Android tablet', 'Windows tablet']
  },
  {
    num: '03',
    title: 'Connect',
    body: 'Keep the device linked to the network, the equipment beside it and the accessories it depends on.',
    tags: ['Wi-Fi', 'Cellular', 'Bluetooth', 'RS232 / RS485', 'RJ45']
  },
  {
    num: '04',
    title: 'Integrate',
    body: 'Connect the captured event to the system that runs the business. We work with your software stack.',
    tags: ['WMS', 'ERP', 'MES', 'CMMS', 'MDM']
  }
];

export const industries: Industry[] = [
  {
    id: 'logistics',
    index: '01',
    eyebrow: 'WAREHOUSE & LOGISTICS',
    name: 'Warehouse & Logistics',
    intro:
      'Inbound, storage and outbound are a chain of verification points. Every unrecorded exception travels with the inventory. These scenarios capture the physical truth before it reaches the WMS.',
    scenarios: [
      {
        title: 'Dock-to-stock receiving',
        situation:
          'Inbound pallets arrive mixed-SKU and often against a tight dock schedule. Manual counts drift from the ASN, shortages surface after put-away, and receiving data reaches the WMS late.',
        workflow: [
          'Scan the ASN and pallet license plate at the dock.',
          'Verify carton count and SKU against the expected receipt.',
          'Use UHF RFID for bulk pallet verification where tags are applied.',
          'Flag short, over or unknown items and print an exception label on the spot.',
          'Confirm receipt and release a put-away task to the WMS.'
        ],
        devices: [HT400, HT550, Y100RFID, HT800],
        outcomes: [
          'Receiving discrepancies are caught at the dock, not after put-away.',
          'Dock staff spend time moving goods instead of re-counting them.',
          'WMS inventory reflects the floor within the receiving shift.'
        ],
        note: 'Exception labeling uses a configured HT800 or a compatible paired printer. Confirm media and print width for the SKU.'
      },
      {
        title: 'RFID cycle counting',
        situation:
          'Cycle counts are planned around the cost of counting. Staff work shelf by shelf, counts are incomplete in dense storage, and different teams can reach different numbers for the same SKU.',
        workflow: [
          'Download the count plan and location list to the handheld.',
          'Walk the aisles and capture UHF tags in bulk; scan barcodes for untagged items.',
          'Review duplicates, exceptions and location mismatches on the device.',
          'Run a blind recount for high-variance locations.',
          'Post the count and variance report to WMS / ERP.'
        ],
        devices: [HT550, HT540, Y100RFID],
        outcomes: [
          'More locations counted per shift with the existing team.',
          'Consistent, audit-ready count records.',
          'Faster identification of shrink and misplaced stock.'
        ]
      },
      {
        title: 'Pick, pack and dispatch',
        situation:
          'Orders leave with the wrong item, quantity or label, and the error is discovered by the customer. Pack stations become a bottleneck when labels are printed somewhere else.',
        workflow: [
          'Scan the pick location and item against the order.',
          'Verify quantity and serial or lot where required.',
          'Pack to the carton and scan the carton ID.',
          'Print the shipping label and packing document at the station.',
          'Confirm dispatch and hand tracking data to the WMS / TMS.'
        ],
        devices: [HT400, HT800, Y100],
        outcomes: [
          'Order accuracy is verified before the parcel leaves.',
          'Fewer trips and reprints between pack station and office printer.',
          'Dispatch status is available to customer service in real time.'
        ],
        note: 'Station printing requires a configured HT800 or a compatible label printer.'
      }
    ]
  },
  {
    id: 'manufacturing',
    index: '02',
    eyebrow: 'MANUFACTURING',
    name: 'Manufacturing',
    intro:
      'On the line, data is only useful when it is captured at the point of work. These scenarios connect materials, machines and people without adding another layer of paperwork.',
    scenarios: [
      {
        title: 'Work-order execution and WIP',
        situation:
          'Work orders are printed, signed and entered later. WIP status is a guess between stations, and scrap or rework is recorded after the fact.',
        workflow: [
          'Scan the work order and material at the first station.',
          'Confirm routing and component consumption at each operation.',
          'Capture pass, fail, scrap and rework codes at the station.',
          'Scan the unit into the next operation or finished-goods area.',
          'Post production confirmation to ERP / MES.'
        ],
        devices: [HT510, HT520, Y100],
        outcomes: [
          'WIP visibility between operations.',
          'Production records captured at the point of work.',
          'Scrap and rework traceable to the operation and operator.'
        ]
      },
      {
        title: 'Material traceability and kitting',
        situation:
          'A quality issue triggers a search through paper records. Lot numbers are incomplete, and kitting errors are found only when the line stops.',
        workflow: [
          'Scan the kit list and each bin or component during kitting.',
          'Validate lot, quantity and expiry against the work order.',
          'Flag missing or wrong components before the kit leaves staging.',
          'Scan the kit into the line and bind components to the work order.',
          'Keep a component-to-unit record for quality and recall.'
        ],
        devices: [HT510, HT520, A100],
        outcomes: [
          'Component-to-unit traceability without paper.',
          'Kitting errors caught before a line stop.',
          'Faster containment when a supplier lot is flagged.'
        ]
      },
      {
        title: 'Equipment inspection rounds',
        situation:
          'Maintenance rounds are recorded on clipboards. Findings are transcribed later, and the same fault is rediscovered on the next shift.',
        workflow: [
          'Scan the asset tag at the machine.',
          'Load the inspection checklist and record readings or conditions.',
          'Capture photo evidence and flag out-of-tolerance values.',
          'Raise a work request or spare-part requirement on the spot.',
          'Sync completed rounds and findings to the CMMS / EAM.'
        ],
        devices: [A100, Y100, HT510],
        outcomes: [
          'Inspection history tied to the asset, not to a clipboard.',
          'Findings reach maintenance before the next shift.',
          'Wired connection to legacy equipment where required.'
        ],
        note: 'RS232 / RS485 and RJ45 connectivity depends on the A100 SKU and configuration. Confirm the required ports before quotation.'
      }
    ]
  },
  {
    id: 'retail',
    index: '03',
    eyebrow: 'RETAIL & COMMERCE',
    name: 'Retail & Commerce',
    intro:
      'Store teams are judged on availability and accuracy. The right capture tool shortens the gap between what the shelf shows and what the system believes.',
    scenarios: [
      {
        title: 'Replenishment and price accuracy',
        situation:
          'Shelf gaps are reported from memory, price labels drift from the POS, and backroom stock is invisible during a busy trading day.',
        workflow: [
          'Scan the shelf label or item to check price and stock.',
          'Record shelf quantity and backroom availability.',
          'Flag gaps and price mismatches for action.',
          'Generate a replenishment or price-change task.',
          'Sync counts to the store system.'
        ],
        devices: [HT400, HT510, Y70],
        outcomes: [
          'Shelf accuracy checked during normal store walks.',
          'Price mismatches caught before the customer sees them.',
          'Replenishment based on a counted shelf, not an estimate.'
        ]
      },
      {
        title: 'RFID item-level stocktake',
        situation:
          'Stocktakes require extra staff and closed hours. Counts are incomplete in dense displays, and the same item is counted twice.',
        workflow: [
          'Load the store layout and count zones.',
          'Sweep fixtures with UHF RFID; scan barcodes for untagged items.',
          'Review duplicates and exceptions on the device.',
          'Recount high-variance zones.',
          'Post results to the merchandise system.'
        ],
        devices: [HT550, HT540, Y100RFID],
        outcomes: [
          'Faster stocktakes with fewer staff hours.',
          'Count records that can be audited.',
          'A clearer view of shrinkage and misplaced stock.'
        ]
      },
      {
        title: 'Mobile labeling and service',
        situation:
          'Staff leave the customer to find a label printer. Price changes and markdowns wait, and the customer experience suffers.',
        workflow: [
          'Scan the item to confirm identity and current price.',
          'Select the required label or document template.',
          'Print on the spot where the device is configured with a printer.',
          'Attach the label and confirm the update.',
          'Sync the price or markdown event to the POS.'
        ],
        devices: [HT800, HT400, HT510],
        outcomes: [
          'Labeling done at the point of decision.',
          'Fewer trips to a back-office printer.',
          'Price changes reflected consistently.'
        ],
        note: 'HT800 mobile printing is configuration-dependent. Confirm the print module, media and print width before deployment.'
      }
    ]
  },
  {
    id: 'field-service',
    index: '04',
    eyebrow: 'FIELD SERVICE & ASSET TRACKING',
    name: 'Field Service & Asset Tracking',
    intro:
      'Field teams work where the network, the weather and the asset are all unpredictable. These scenarios keep records complete and assets visible.',
    scenarios: [
      {
        title: 'Inspection and digital work orders',
        situation:
          'Job sheets are completed on paper and keyed in at the end of the day. Photos are filed separately, and the office cannot see job status until the technician returns.',
        workflow: [
          'Receive the job and asset details on the device.',
          'Scan the asset tag on arrival.',
          'Complete the checklist, readings and photo evidence.',
          'Capture the customer signature and close the job.',
          'Sync the completed work order when connectivity is available.'
        ],
        devices: [Y70, Y100, A100],
        outcomes: [
          'Job status visible while the technician is still on site.',
          'Complete evidence attached to the asset record.',
          'Less end-of-day administration.'
        ]
      },
      {
        title: 'Asset tagging and audit rounds',
        situation:
          'Asset registers are out of date. Audits are annual events, and missing or moved assets are discovered late.',
        workflow: [
          'Load the asset list and audit scope.',
          'Walk the site and capture UHF tags in bulk.',
          'Scan close-range tags or barcodes where required.',
          'Flag missing, moved or unknown assets.',
          'Post the audit result to the asset system.'
        ],
        devices: [HT550, HT540, Y100RFID],
        outcomes: [
          'Audits completed in hours, not days.',
          'Missing assets identified at the point of audit.',
          'The asset register maintained between formal audits.'
        ]
      },
      {
        title: 'On-site service and documentation',
        situation:
          'A field engineer needs to label a repaired asset, print a service record or verify an identity document on site. Leaving to find equipment delays the visit.',
        workflow: [
          'Scan the asset and retrieve its service history.',
          'Record parts used and work performed.',
          'Print a service label or receipt where the configuration supports it.',
          'Capture a signature or document reference where required.',
          'Sync the record to the service platform.'
        ],
        devices: [HT800, HT530, Y70],
        outcomes: [
          'Service records completed during the visit.',
          'On-site labeling and documentation.',
          'Fewer return visits for missing paperwork.'
        ],
        note: 'HT530 document reading requires the appropriate regional module and approved document support. Confirm before deployment.'
      }
    ]
  }
];

export const specializedWorkflows: SpecializedWorkflow[] = [
  {
    eyebrow: 'HEALTHCARE-ORIENTED WORKFLOWS',
    title: 'HT510 Medical edition',
    body:
      'A handheld configuration positioned for bedside identification, specimen and medication administration support, and equipment checks. Healthcare deployments require workflow validation against local requirements.',
    points: [
      'Patient, specimen and asset identification',
      'One-handed form factor for bedside tasks',
      'Cleaning and disinfection requirements confirmed with the approved configuration'
    ],
    devices: [HT510]
  },
  {
    eyebrow: 'DOCUMENT & IDENTITY CAPTURE',
    title: 'HT530 Document & ID Capture',
    body:
      'A specialized handheld for service counters, controlled access and field verification where an identity or document must be read and recorded. Reader compatibility varies by country and document type.',
    points: [
      'Counter and field identity workflows',
      'Document reader module confirmed per region',
      'Positioned for controlled enterprise and public-service deployments'
    ],
    devices: [HT530]
  }
];

export const solutionMatrix = [
  {
    industry: 'Warehouse & Logistics',
    tasks: 'Receiving, put-away, cycle counting, picking, packing, dispatch',
    devices: 'HT400 · HT550 · HT800 · Y100 RFID',
    capture: '1D / 2D barcode, UHF RFID, mobile print'
  },
  {
    industry: 'Manufacturing',
    tasks: 'Work orders, WIP, kitting, traceability, maintenance rounds',
    devices: 'HT510 · HT520 · A100 · Y100',
    capture: 'Barcode, NFC, wired I/O, photo evidence'
  },
  {
    industry: 'Retail & Commerce',
    tasks: 'Replenishment, price checks, stocktakes, labeling',
    devices: 'HT400 · HT540 · HT550 · HT800 · Y70',
    capture: 'Barcode, UHF RFID, mobile print'
  },
  {
    industry: 'Field Service & Assets',
    tasks: 'Inspections, work orders, asset audits, on-site documentation',
    devices: 'Y70 · Y100 · HT550 · HT530 · HT800',
    capture: 'Barcode, UHF RFID, document reading, mobile print'
  }
];

export const deploymentSteps = [
  {
    title: 'Workflow review',
    body: 'Map the current steps, the exceptions and the data each step must produce. Agree what good looks like before selecting hardware.'
  },
  {
    title: 'Configuration',
    body: 'Choose the form factor, capture modules, OS, accessories and integration points. Confirm regional bands and approvals.'
  },
  {
    title: 'Pilot',
    body: 'Deploy to one site or one shift. Compare accuracy, cycle time and exception rates with the current process.'
  },
  {
    title: 'Rollout & support',
    body: 'Stage devices, configure MDM, train users, plan spares and agree the support path for the fleet.'
  }
];
