import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { UiSwitchModule } from 'ngx-toggle-switch/src';
@NgModule({
    imports: [RouterModule, CommonModule, UiSwitchModule ],
    declarations: [ SidebarComponent ],
    exports: [ SidebarComponent ]
})

export class SidebarModule {}
