import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { CountryService } from '../../services/countries.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  constructor(private countryService: CountryService) {}

  ngOnInit() {
    this.generatePopulationBarGraph();
    this.generateContinentPieChart();
    this.generateLanguagePieChart();
  }

  generatePopulationBarGraph() {
    // Fetch top 5 countries by population
    this.countryService.getCountries({}).subscribe(
      (data) => {
        const countriesWithPopulation = data
          .filter(country => country.population)
          .sort((a, b) => parseInt(b.population, 10) - parseInt(a.population, 10))
          .slice(0, 5);
  
        const labels = countriesWithPopulation.map(country => country.name);
        const populations = countriesWithPopulation.map(country => parseInt(country.population, 10));
  
        const canvas: any = document.getElementById('population-bar-chart');
        const ctx = canvas.getContext('2d');
  
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Population',
              data: populations,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      },
      error => {
        console.error('Error fetching data for the bar graph:', error);
      }
    );
  }  

  generateContinentPieChart() {
    // Fetch countries and group them by continent
    this.countryService.getCountries({}).subscribe(
      (data) => {
        const continentCounts: { [key: string]: number } = {}; // Define type for continentCounts
  
        data.forEach(country => {
          const continents = country.continents.split(', '); // Assuming continents are separated by ', '
          continents.forEach(continent => {
            continentCounts[continent] = (continentCounts[continent] || 0) + 1;
          });
        });
  
        const labels = Object.keys(continentCounts);
        const counts = Object.values(continentCounts);
  
        const canvas: any = document.getElementById('continent-pie-chart');
        const ctx = canvas.getContext('2d');
  
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              label: 'Countries per Continent',
              data: counts,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1
            }]
          }
        });
      },
      error => {
        console.error('Error fetching data for the continent pie chart:', error);
      }
    );
  }  

  generateLanguagePieChart() {
    this.countryService.groupByLanguage().subscribe(
      (data) => {
        const languageData = data.map(item => ({
          name: item.name,
          count: (item as any).count
        }));
  
        const labels = languageData.map(language => language.name);
        const counts = languageData.map(language => language.count);
  
        const canvas: any = document.getElementById('language-pie-chart');
        const ctx = canvas.getContext('2d');
  
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              label: 'Countries per Language',
              data: counts,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1
            }]
          }
        });
      },
      error => {
        console.error('Error fetching data for the language pie chart:', error);
      }
    );
  }  
}
