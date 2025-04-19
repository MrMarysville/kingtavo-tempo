# Phase 4: Production Management

This document outlines the implementation steps for Phase 4 of the Kingtavo platform, focusing on production management including task engine, kanban board, and workflow management.

## 4.1 Task Engine

### 4.1.1 Task Creation and Assignment (✅ Completed)

Implement task creation and assignment:

```typescript
// src/lib/tasks.ts
export async function createTask(task: {
  company_id: string;
  order_id?: string;
  line_item_id?: string;
  title: string;
  description?: string;
  status: string;
  assigned_to?: string;
  due_date?: string;
  priority?: string;
}) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select();
  return { data, error };
}

export async function assignTask(taskId: string, userId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ assigned_to: userId })
    .eq('id', taskId)
    .select();
  return { data, error };
}

export async function getTasks(companyId: string, filters?: {
  status?: string;
  assigned_to?: string;
  order_id?: string;
}) {
  let query = supabase
    .from('tasks')
    .select('*, assigned_to:users(*), order:order_id(*)')
    .eq('company_id', companyId);
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.assigned_to) {
    query = query.eq('assigned_to', filters.assigned_to);
  }
  
  if (filters?.order_id) {
    query = query.eq('order_id', filters.order_id);
  }
  
  const { data, error } = await query;
  return { data, error };
}
```

### 4.1.2 Task Status Tracking (✅ Completed)

Implement task status tracking:

```typescript
// src/lib/tasks.ts
export async function updateTaskStatus(taskId: string, status: string) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)
    .select();
  return { data, error };
}

export async function getTaskHistory(taskId: string) {
  const { data, error } = await supabase
    .from('task_history')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: false });
  return { data, error };
}
```

### 4.1.3 Task Priority and Due Dates (🟡 In Progress)

Implement task priority and due dates:

#### Rush Order Prioritization
- Rush flag identification
- Priority level assignment
- Visual indicators
- Notification system
- Schedule impact assessment

#### Due Date Calculations
- Decoration-specific lead times
- Quantity-based adjustments
- Complexity factors
- Material availability consideration
- Production capacity awareness

#### Production Capacity-Aware Scheduling
- Resource availability checking
- Workload balancing
- Bottleneck identification
- Schedule optimization
- Capacity forecasting

#### Lead Time Adjustments
- Decoration complexity factors
- Special process requirements
- Material preparation time
- Equipment setup time
- Quality control requirements

#### Deadline Notifications
- Approaching deadline alerts
- Missed deadline notifications
- Escalation procedures
- Stakeholder communication
- Rescheduling workflow

### 4.1.4 Screen Room Workflow (❌ Not Started)

Implement screen room workflow:

#### Screen Coating Tracking
- Screen selection by mesh count
- Coating type and thickness
- Drying time tracking
- Screen quality verification
- Recoating tracking

#### Exposure Time Logging
- Exposure unit settings
- Exposure time calculation
- Exposure results tracking
- Troubleshooting documentation
- Process optimization

#### Screen Reclaiming Process
- Reclaiming schedule
- Chemical usage tracking
- Screen condition assessment
- Reclaiming history
- Screen lifecycle management

#### Screen Inventory Management
- Screen tracking by size and mesh
- Available/in-use status
- Screen location tracking
- Maintenance scheduling
- Replacement forecasting

#### Mesh Count Assignment
- Automatic mesh recommendation
- Ink type compatibility
- Artwork detail requirements
- Substrate considerations
- Print quality factors

### 4.1.5 Embroidery Digitizing Queue (❌ Not Started)

Create embroidery digitizing queue:

#### Complexity Assessment
- Stitch count estimation
- Detail level evaluation
- Special technique requirements
- Size considerations
- Color complexity

#### Stitch Count Estimation
- Design size factors
- Detail level analysis
- Fill area calculation
- Special stitch requirements
- Automatic estimation tools

#### Thread Color Selection
- Color matching to standards
- Thread brand compatibility
- Stock availability checking
- Alternative suggestions
- Custom color handling

#### Test Sew-Out Tracking
- Sample creation workflow
- Quality assessment
- Adjustment tracking
- Approval process
- Production readiness verification

#### Digitizing Time Tracking
- Time estimation
- Actual time logging
- Efficiency metrics
- Complexity correlation
- Resource allocation optimization

### 4.1.6 Press/Machine Scheduling (❌ Not Started)

Set up press/machine scheduling:

#### Job Sequencing by Color
- Ink/thread color grouping
- Color change minimization
- Setup time reduction
- Wash-up optimization
- Production efficiency maximization

#### Setup Time Allocation
- Equipment-specific setup times
- Complexity-based adjustments
- Crew skill factor
- Previous job considerations
- Setup reduction strategies

#### Production Speed Estimates
- Decoration technique factors
- Quantity considerations
- Substrate impact
- Equipment capabilities
- Operator skill level

#### Operator Skill Matching
- Skill level tracking
- Job complexity matching
- Training opportunity identification
- Specialized skill allocation
- Team balancing

#### Machine Maintenance Windows
- Preventive maintenance scheduling
- Production impact minimization
- Maintenance history tracking
- Performance monitoring
- Downtime reduction strategies

### 4.1.7 Material Preparation Tasks (❌ Not Started)

Implement material preparation tasks:

#### Garment Sorting and Counting
- Order breakdown by size/color
- Count verification
- Defect inspection
- Sorting workflow
- Staging for decoration

#### Ink Mixing and Preparation
- Formula documentation
- Quantity calculation
- Mixing instructions
- Color matching verification
- Ink preparation tracking

#### Thread Color Pull Lists
- Color identification by code
- Quantity calculation
- Pull list generation
- Verification process
- Restocking workflow

#### Screen Preparation Sequence
- Screen selection
- Degreasing process
- Coating application
- Drying tracking
- Exposure preparation

#### Pretreatment Scheduling for DTG
- Garment identification
- Pretreatment formula selection
- Application method
- Drying requirements
- Quality verification

### 4.1.8 Quality Control Checkpoints (❌ Not Started)

Create quality control checkpoints:

#### Print Quality Inspection
- Registration verification
- Color accuracy checking
- Coverage assessment
- Cure testing
- Defect identification

#### Embroidery Quality Checks
- Thread tension verification
- Registration accuracy
- Thread breaks inspection
- Backing assessment
- Trimming quality

#### Garment Inspection Workflow
- Pre-decoration inspection
- Post-decoration inspection
- Final product review
- Packaging verification
- Customer standards compliance

#### Sampling Requirements
- Order size-based sampling
- Critical checkpoint identification
- Acceptance criteria
- Documentation requirements
- Rejection handling

#### Wash Test Protocols
- Test sample selection
- Wash test procedures
- Assessment criteria
- Documentation requirements
- Failure response protocol

### 4.1.9 Automatic Task Generation (❌ Not Started)

Set up automatic task generation based on order type:

#### Task Templates by Decoration
- Screen printing task sequence
- Embroidery task sequence
- DTG task sequence
- Vinyl/heat transfer task sequence
- Hybrid decoration workflows

#### Conditional Task Generation
- Order attribute-based conditions
- Product type considerations
- Decoration complexity factors
- Customer requirements
- Special handling needs

#### Parallel vs. Sequential Workflows
- Dependency mapping
- Critical path identification
- Resource allocation
- Timeline optimization
- Bottleneck avoidance

#### Task Dependency Mapping
- Prerequisite relationships
- Successor relationships
- Timing constraints
- Resource dependencies
- Conditional dependencies

#### Automatic Assignment Rules
- Skill-based routing
- Workload balancing
- Specialization matching
- Team structure consideration
- Availability checking

## 4.2 Kanban Board

### 4.2.1 Kanban Board for Task Management (✅ Completed)

Implement kanban board for task management:

```typescript
// src/components/kanban/board.tsx
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getTasks, updateTaskStatus } from '@/lib/tasks';

export function KanbanBoard({ companyId }: { companyId: string }) {
  const [columns, setColumns] = useState({
    'todo': { id: 'todo', title: 'To Do', tasks: [] },
    'in-progress': { id: 'in-progress', title: 'In Progress', tasks: [] },
    'review': { id: 'review', title: 'Review', tasks: [] },
    'done': { id: 'done', title: 'Done', tasks: [] },
  });
  
  useEffect(() => {
    const fetchTasks = async () => {
      const { data: tasks } = await getTasks(companyId);
      
      if (tasks) {
        const newColumns = { ...columns };
        
        // Reset tasks in each column
        Object.keys(newColumns).forEach(key => {
          newColumns[key].tasks = [];
        });
        
        // Distribute tasks to columns based on status
        tasks.forEach(task => {
          const status = task.status.toLowerCase().replace(' ', '-');
          if (newColumns[status]) {
            newColumns[status].tasks.push(task);
          } else {
            newColumns['todo'].tasks.push(task);
          }
        });
        
        setColumns(newColumns);
      }
    };
    
    fetchTasks();
  }, [companyId]);
  
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    const startColumn = columns[source.droppableId];
    const endColumn = columns[destination.droppableId];
    
    if (startColumn === endColumn) {
      // Reordering within the same column
      const newTasks = Array.from(startColumn.tasks);
      const [movedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedTask);
      
      const newColumn = {
        ...startColumn,
        tasks: newTasks,
      };
      
      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
    } else {
      // Moving from one column to another
      const startTasks = Array.from(startColumn.tasks);
      const [movedTask] = startTasks.splice(source.index, 1);
      
      const endTasks = Array.from(endColumn.tasks);
      endTasks.splice(destination.index, 0, movedTask);
      
      const newStartColumn = {
        ...startColumn,
        tasks: startTasks,
      };
      
      const newEndColumn = {
        ...endColumn,
        tasks: endTasks,
      };
      
      setColumns({
        ...columns,
        [newStartColumn.id]: newStartColumn,
        [newEndColumn.id]: newEndColumn,
      });
      
      // Update task status in the database
      const newStatus = endColumn.id.replace('-', ' ');
      await updateTaskStatus(draggableId, newStatus);
    }
  };
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Object.values(columns).map(column => (
          <div key={column.id} className="w-80 flex-shrink-0">
            <h3 className="font-medium mb-3">{column.title}</h3>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 rounded-md p-3 min-h-[500px]"
                >
                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 rounded-md shadow-sm mb-2"
                        >
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-gray-500 truncate">{task.description}</p>
                          {task.assigned_to && (
                            <div className="mt-2 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1 inline-block">
                              {task.assigned_to.first_name} {task.assigned_to.last_name}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
```

### 4.2.2 Custom Columns for Decoration Workflows (❌ Not Started)

Create custom columns for print/embroidery workflow:

#### Screen Printing Columns
- Art approval
- Screens prepared
- On press
- Drying/curing
- Quality control
- Finishing

#### Embroidery Columns
- Art approval
- Digitizing
- Hooping
- On machine
- Trimming/finishing
- Quality control

#### DTG Workflow Stages
- Art approval
- Pretreatment
- Printing
- Curing
- Quality control
- Finishing

#### Vinyl/Heat Transfer Stages
- Art approval
- Cutting
- Weeding
- Application
- Quality control
- Finishing

#### Hybrid Decoration Workflow
- Combined workflow stages
- Parallel process tracking
- Sequential dependency management
- Consolidated view
- Cross-technique coordination

### 4.2.3 Work Center Specific Views (❌ Not Started)

Implement work center specific views:
- Art department view
- Screen room view
- Press room view
- Embroidery department view
- Finishing department view
- Shipping department view

### 4.2.4 WIP Limits Based on Capacity (❌ Not Started)

Set up WIP limits based on capacity:
- Column-specific WIP limits
- Visual indicators for approaching limits
- Enforcement mechanisms
- Override protocols
- Capacity adjustment tools

### 4.2.5 Drag-and-Drop Job Scheduling (❌ Not Started)

Create drag-and-drop job scheduling:
- Visual calendar interface
- Resource allocation visualization
- Conflict detection
- Schedule optimization suggestions
- Real-time updates

### 4.2.6 Production Metrics Tracking (❌ Not Started)

Implement production metrics tracking:
- Throughput measurement
- Cycle time calculation
- Lead time tracking
- WIP monitoring
- Efficiency metrics
- Quality metrics

### 4.2.7 Bottleneck Identification (❌ Not Started)

Set up bottleneck identification:
- Queue size monitoring
- Process time analysis
- Resource utilization tracking
- Constraint identification
- Improvement suggestion system

## 4.3 Mobile Optimization

### 4.3.1 Mobile-Friendly Interfaces (🟡 In Progress)

Implement mobile-friendly interfaces:
- Responsive design for all screens
- Touch-optimized controls
- Simplified mobile views
- Performance optimization
- Offline capabilities

### 4.3.2 Shop Floor Tablet Interfaces (❌ Not Started)

Create shop floor tablet interfaces:

#### Press Operator Interface
- Job queue display
- Setup instructions
- Production tracking
- Quality checkpoints
- Issue reporting

#### Embroidery Machine Operator View
- Job queue display
- Thread color requirements
- Machine settings
- Production tracking
- Issue reporting

#### DTG Production Interface
- Job queue display
- Pretreatment instructions
- Print settings
- Production tracking
- Quality checkpoints

#### Heat Press Operator Screens
- Job queue display
- Application instructions
- Temperature/time settings
- Production tracking
- Quality checkpoints

#### Quality Control Mobile Interface
- Inspection checklist
- Defect reporting
- Photo documentation
- Approval workflow
- Production release

### 4.3.3 Barcode/QR Scanning (❌ Not Started)

Implement barcode/QR scanning for job tracking:
- Order/job barcode generation
- Mobile scanning capability
- Status update via scan
- Location tracking
- Inventory management
- Asset tracking

### 4.3.4 Mobile Production Reporting (❌ Not Started)

Set up mobile production reporting:
- Production status updates
- Issue reporting
- Quality control results
- Time tracking
- Material usage reporting
- Equipment status updates

### 4.3.5 Mobile Quality Control Checklists (❌ Not Started)

Create mobile quality control checklists:
- Technique-specific inspection points
- Pass/fail criteria
- Photo documentation
- Defect categorization
- Corrective action tracking
- Approval workflow

### 4.3.6 Mobile Artwork Approval (❌ Not Started)

Implement mobile artwork approval:
- Artwork preview optimization
- Approval/rejection workflow
- Annotation tools
- Comment system
- Version comparison
- Approval history

## 4.4 Realtime Updates

### 4.4.1 Supabase Realtime Implementation (🟡 In Progress)

Implement real-time updates with Supabase Realtime:

```typescript
// src/lib/realtime.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function subscribeToTasks(callback: (payload: any) => void) {
  const subscription = supabase
    .channel('tasks-channel')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'tasks',
    }, (payload) => {
      callback(payload);
    })
    .subscribe();
  
  return () => {
    supabase.removeChannel(subscription);
  };
}

export function subscribeToOrders(callback: (payload: any) => void) {
  const subscription = supabase
    .channel('orders-channel')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'orders',
    }, (payload) => {
      callback(payload);
    })
    .subscribe();
  
  return () => {
    supabase.removeChannel(subscription);
  };
}
```

### 4.4.2 Production Status Notifications (❌ Not Started)

Create production status notifications:
- Status change alerts
- Critical milestone notifications
- Delay warnings
- Completion notifications
- Issue alerts
- Action required notifications

### 4.4.3 Customer Alerts for Order Milestones (❌ Not Started)

Set up customer alerts for order milestones:
- Order received confirmation
- Artwork approval request
- Production start notification
- Quality control passed alert
- Shipping notification
- Delivery confirmation

### 4.4.4 Real-Time Production Dashboard (❌ Not Started)

Implement real-time production dashboard:
- Current production status
- WIP visualization
- Resource utilization
- Queue status
- Bottleneck indicators
- Performance metrics

### 4.4.5 Machine Status Monitoring (❌ Not Started)

Create machine status monitoring:
- Equipment operational status
- Current job assignment
- Production rate tracking
- Maintenance status
- Downtime tracking
- Utilization metrics

### 4.4.6 Shift Productivity Tracking (❌ Not Started)

Set up shift productivity tracking:
- Shift-based production metrics
- Team performance comparison
- Individual productivity
- Quality metrics by shift
- Efficiency trending
- Goal achievement tracking
