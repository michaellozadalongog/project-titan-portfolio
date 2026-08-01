# Replace the Current GitHub Pages Site

Repository: `https://github.com/michaellozadalongog/project-titan-portfolio`

## Safest web-browser method

1. Download and unzip `Project_TITAN_Portfolio_V3_GitHub.zip`.
2. Open the existing GitHub repository.
3. Delete the old website files, or create a clean replacement commit.
4. Choose **Add file → Upload files**.
5. Drag every item *inside* the unzipped folder into GitHub:
   - `index.html`
   - `project-titan.html`
   - `documentation.html`
   - `resume.html`
   - `404.html`
   - `assets/`
   - `engineering-documents/`
   - `.nojekyll`
   - `README.md`
   - the remaining support files
6. Confirm that `index.html` is at the top level.
7. Commit with: `Release Project TITAN Portfolio V3`
8. Open **Settings → Pages** and confirm:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/(root)**
9. Wait for GitHub Pages to finish, then hard-refresh the site.

Live address:

https://michaellozadalongog.github.io/project-titan-portfolio/

## Common error

If the page is unstyled or images are broken, the `assets` folder was flattened or omitted. Preserve the folder structure exactly as supplied.
