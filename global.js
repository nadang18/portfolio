console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// const navLinks = $$("nav a");

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
//   );

// currentLink?.classList.add('current');


let pages = [
    { url: 'index.html', title: 'Home' },
    { url: 'projects/index.html', title: 'Projects' },
    { url: 'contact/index.html', title: 'Contact' },
    { url: 'resume/index.html', title: 'Resume' },
    { url: 'https://github.com/nadang18', title: 'GitHub Profile'}
  ];

let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
    console.log(url);

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    
    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname
      );

    a.toggleAttribute('target', a.host !== location.host);

    if (a.host !== location.host) {
        a.target = "_blank";
    }

    nav.append(a);
  }


// Light mode Dark mode Switch
document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
      Theme:
      <select id="color-scheme-switch">
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>`
);

const select = document.querySelector('#color-scheme-switch');

select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value
  });

  if (localStorage.colorScheme) {
    select.value = localStorage.colorScheme;
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
  }

  const form = document.querySelector('form');

  form?.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new FormData(event.target);
    let url = form.action + '?';
    for (let [name, value] of data) {
        url = url + `${name}` + '=' + `${encodeURIComponent(value)}` + '&';
        // console.log(name, encodeURIComponent(value));
        // console.log(form.action);
        console.log(url)
      }
      location.href = url;
  });
  
export async function fetchJSON(url) {
  try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);

      // Check if the fetch request was successful
      if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }

      // Parse the response into JSON format
      const data = await response.json();
      return data;

  } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(project, containerElement, headingLevel = 'h2') {
    // Clear existing content
    containerElement.innerHTML = '';

    for (let proj in project) {
      // Create an article element for the project
      const article = document.createElement('article');

      article.innerHTML = `
          <${headingLevel}>${proj.title}</${headingLevel}>
          <img src="${proj.image}" alt="${proj.title}">
          <p>${proj.description}</p>
      `;

      // Append the article to the container element
      containerElement.appendChild(article);
    }
}
