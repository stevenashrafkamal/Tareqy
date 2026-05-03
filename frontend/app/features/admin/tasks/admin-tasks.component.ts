import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService, Task } from '../../../services/tasks.service';

@Component({
  selector: 'app-admin-tasks',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page">
      <div class="header">
        <h1>Tasks Management</h1>
        <button class="btn-primary">New Task</button>
      </div>

      <div class="card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Attached To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let task of tasks()">
              <td><strong>{{ task.title }}</strong></td>
              <td class="desc-col">{{ task.description | slice:0:50 }}...</td>
              <td>
                <span class="badge-track" *ngIf="task.track_id">Track</span>
                <span class="badge-track" *ngIf="task.level_id">Level</span>
                <span class="badge-track" *ngIf="task.step_id">Step</span>
              </td>
              <td class="actions">
                <button class="btn-delete" (click)="deleteTask(task._id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-page { display: flex; flex-direction: column; gap: 1.5rem; animation: slide-up 0.5s ease-out forwards; }
    @keyframes slide-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    .header { display: flex; justify-content: space-between; align-items: center; }
    .header h1 { font-family: var(--font-serif); color: var(--gold-matte); margin: 0; text-shadow: 0 0 10px var(--gold-glow); }
    
    .card { background: var(--teal-mid); border-radius: var(--radius-md); border: 1px solid var(--teal-light); overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
    .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
    .admin-table th { background: var(--teal-dark); padding: 1.2rem 1rem; border-bottom: 2px solid var(--teal-light); font-weight: 600; color: var(--gold-matte); font-family: var(--font-sans); text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.05em; }
    .admin-table td { padding: 1.2rem 1rem; border-bottom: 1px solid var(--teal-light); color: var(--text-primary); transition: var(--transition); }
    .admin-table tbody tr:hover td { background: rgba(22, 91, 104, 0.4); } 
    
    .desc-col { color: var(--text-muted); font-size: 0.9rem; }
    .badge-track { background: rgba(212, 175, 55, 0.15); color: var(--gold-matte); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; border: 1px solid rgba(212, 175, 55, 0.3); text-transform: uppercase; font-weight: 700; margin-right: 0.3rem;}
    
    .btn-primary { background: var(--gold-matte); color: var(--text-dark); border: 1px solid var(--gold-glow); padding: 0.6rem 1.2rem; border-radius: 4px; font-weight: 700; cursor: pointer; transition: var(--transition); box-shadow: 0 0 10px var(--gold-glow); letter-spacing: 0.05em; }
    .btn-primary:hover { background: #E5C158; box-shadow: 0 0 20px var(--gold-glow); transform: translateY(-2px); }
    
    .actions button { background: none; border: none; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: var(--transition); text-transform: uppercase; letter-spacing: 0.05em; }
    .btn-delete { color: #f87171; }
    .btn-delete:hover { color: #fca5a5; text-shadow: 0 0 8px rgba(239, 68, 68, 0.6); transform: scale(1.05); }
  `]
})
export class AdminTasksComponent implements OnInit {
  tasks = signal<Task[]>([]);

  constructor(private tasksService: TasksService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.tasksService.getAllTasks().subscribe(res => {
      this.tasks.set(res);
    });
  }

  deleteTask(id: string) {
    if(confirm('Delete this task?')) {
      this.tasksService.deleteTask(id).subscribe(() => this.loadTasks());
    }
  }
}
