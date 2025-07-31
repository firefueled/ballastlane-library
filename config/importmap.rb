pin "application"

# React via CDN (Importmap)
pin "react", to: "https://ga.jspm.io/npm:react@18.2.0/index.js", preload: true
pin "react-dom", to: "https://ga.jspm.io/npm:react-dom@18.2.0/index.js", preload: true

# Componentes da sua aplicação React
pin_all_from "app/javascript/components", under: "components"
