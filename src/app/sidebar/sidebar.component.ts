import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
declare var $: any;

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    demo: boolean;
}

export const ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Dashboard',  icon: 'ti-panel', class: '', demo: true },
    { path: 'user', title: 'User Profile', icon: 'ti-user', class: '', demo: true },
    { path: 'table', title: 'Table List', icon: 'ti-view-list-alt', class: '', demo: false },
    { path: 'typography', title: 'Typography', icon: 'ti-text', class: '', demo: false},
    { path: 'icons', title: 'Icons', icon: 'ti-pencil-alt2', class: '', demo: false },
    { path: 'maps', title: 'Maps', icon: 'ti-map', class: '', demo: false },
    { path: 'notifications', title: 'Notifications', icon: 'ti-bell', class: '', demo: true }
//    { path: 'upgrade', title: 'DigiSquire',  icon:'/logo.png', class: 'active-pro' }
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => {
            if (environment.hideRoutes) { return menuItem.demo === true; }else {
             return menuItem;
        } });
    }
    isNotMobileMenu(){
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }

}
