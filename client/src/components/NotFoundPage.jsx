import { Link } from 'react-router-dom';

function NotFoundPage() {
    return <>
      <div style={{"textAlign": "center", "paddingTop": "5rem"}}>
        <h1>
          <i className="bi bi-exclamation-circle-fill"/>
          {" "}
          Pagina non trovata!
          {" "}
          <i className="bi bi-exclamation-circle-fill"/>
        </h1>
        <br/>
        <p>
        <Link to={"/"}>La pagina non esiste, torna qui</Link>.
        </p>
      </div>
    </>;
  }

  export default NotFoundPage;