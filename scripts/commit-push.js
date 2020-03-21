const versiony = require("versiony");
const NodeGit = require("nodegit");

console.log("Commit y push de la cosecha");

console.log("Incrementa versión menor");

versiony
  .minor()
  .from("package.json")
  .to();

let repo;
let index;
let oid;

NodeGit.Repository.open(process.cwd())
  .then(repository => {
    repo = repository;
    return repo.index();
  })
  .then(i => (index = i))
  .then(() => index.addByPath("package.json"))
  .then(() => index.write())
  .then(() => index.writeTree())
  .then(oidResult => {
    oid = oidResult;
    return NodeGit.Reference.nameToId(repo, "HEAD");
  })
  .then(head => repo.getCommit(head))
  .then(parent => {
    const author = NodeGit.Signature.now(
      "Roberto Villarejo Martínez",
      "robertovillarejo@outlook.com"
    );
    const commiter = NodeGit.Signature.now(
      "Roberto Villarejo Martínez",
      "robertovillarejo@outlook.com"
    );
    return repo.createCommit(
      "HEAD",
      author,
      commiter,
      "Cosecha de documentación",
      oid,
      [parent]
    );
  })
  .done(commitId => console.log("Nuevo commit: ", commitId));
