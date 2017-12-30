import { Routes, RouterModule } from '@angular/router';
import { CurrencyComponent } from "./currency/currency.component";
import { LooperComponent } from "./weather/weather.component";
import { MovieComponent } from "./movie/movie.component";
import { AppComponent } from "./app.component";
const MAINMENU_ROUTES: Routes = [
    //full : makes sure the path is absolute path
    { path: '', redirectTo: '/movie', pathMatch: 'full' },
    { path: 'weather', component: LooperComponent },
    { path: 'movie', component: MovieComponent },
    { path: 'currency', component: CurrencyComponent } 
];
export const CONST_ROUTING = RouterModule.forRoot(MAINMENU_ROUTES);