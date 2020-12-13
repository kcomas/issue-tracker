import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { IssueTrackerModule } from './issue-tracker/issue-tracker.module';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, IssueTrackerModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
