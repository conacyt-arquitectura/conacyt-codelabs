const registry = require("../registry");
const NodeGit = require("nodegit");
const tmp = require("tmp");
const fs = require("fs-extra");

// Se descarga la carpeta $CODELABS_REPO_DIR de la rama $DOCS_BRANCH de cada repositorio
const DOCS_BRANCH = "docs";
const CODELABS_REPO_DIR = "codelabs";

// La carpeta donde se descargan los codelabs
const CODELABS_FETCHED_DIR = "codelabs/src";

console.info(
  "Descargando documentación de los proyectos registrados...",
  registry
);

registry.forEach(fetchCodelabs);

function fetchCodelabs(repo) {
  tmp.dir({ unsafeCleanup: true }, (err, repoDirname, removeCallback) => {
    if (err) {
      console.error(
        "No se pudo crear la carpeta para clonar el repositorio " + repo.name
      );
      return;
    }
    NodeGit.Clone(repo.url, repoDirname, {
      checkoutBranch: DOCS_BRANCH,
      fetchOpts: {
        callbacks: {
          certificateCheck: () => 0,
          credentials: () => {
            return NodeGit.Cred.userpassPlaintextNew(
              process.env.GIT_USERNAME,
              process.env.GIT_PASSWORD
            );
          }
        }
      }
    })
      .then(() => {
        const src = repoDirname + "/" + CODELABS_REPO_DIR;
        const dest =
          process.cwd() + "/" + CODELABS_FETCHED_DIR + "/" + repo.name;
        if (fs.existsSync(src)) {
          fs.copy(src, dest)
            .then(() =>
              console.log(
                "Finalizó copiado de codelabs del repositorio " + repo.name
              )
            )
            .catch(e =>
              console.error(
                "Falló al copiar codelabs del repositorio " + repo.name,
                e
              )
            )
            .finally(() => removeCallback());
        } else {
          console.error(
            "No se encontró la carpeta codelabs en el repositorio " + repo.name
          );
          removeCallback();
        }
      })
      .catch(e => {
        console.error("No se pudo clonar el repositorio " + repo.name, e);
        removeCallback();
      });
  });
}
