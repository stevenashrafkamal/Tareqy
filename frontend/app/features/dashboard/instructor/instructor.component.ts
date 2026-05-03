import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TracksService } from '../../../services/tracks.service';

@Component({
  selector: 'app-instructor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent implements OnInit {
  courses = signal<any[]>([]);

  totalStudents = computed(() => this.courses().reduce((s, c) => s + (c.students || 0), 0));
  publishedCount = computed(() => this.courses().filter(c => c.is_published).length);

  showForm = signal(false);
  newCourse = { title: '', difficulty: 'Medium', description: '' };

  constructor(private tracksService: TracksService) {}

  ngOnInit() {
    this.loadTracks();
  }

  loadTracks() {
    this.tracksService.getAllTracks().subscribe({
      next: (tracks) => this.courses.set(tracks),
      error: () => this.courses.set([
        { _id: '1', title: 'Frontend Navigation', levels: 12, students: 340, is_published: true },
        { _id: '2', title: 'Backend Sails', levels: 8, students: 210, is_published: true },
        { _id: '3', title: 'Database Anchors', levels: 5, students: 0, is_published: false }
      ])
    });
  }

  addCourse() {
    if (!this.newCourse.title) return;
    
    // API Call
    this.tracksService.createTrack(this.newCourse).subscribe({
      next: (res) => {
        this.loadTracks();
        this.resetForm();
      },
      error: () => {
        // Fallback UI mock
        this.courses.update(c => [...c, { _id: Date.now().toString(), title: this.newCourse.title, levels: 0, students: 0, is_published: false }]);
        this.resetForm();
      }
    });
  }

  resetForm() {
    this.newCourse = { title: '', difficulty: 'Medium', description: '' };
    this.showForm.set(false);
  }

  toggleStatus(course: any) {
    const newStatus = !course.is_published;
    this.tracksService.updateTrack(course._id, { is_published: newStatus }).subscribe({
      next: () => course.is_published = newStatus,
      error: () => course.is_published = newStatus // Mock update on fail
    });
  }
}