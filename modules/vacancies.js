async function getVisibleVacancies(page) {
  return page.$$eval(
    'a[data-qa="vacancy-serp__vacancy_response"]',
    (elements) => {
      return elements
        .filter((el) => {
          const style = window.getComputedStyle(el);
          return (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            el.offsetParent !== null
          );
        })
        .map((el) => {
          const url = new URL(el.href, window.location.origin);
          const vacancyId = url.searchParams.get("vacancyId");
          return {
            text: el.innerText.trim(),
            href: el.href,
            vacancyId,
          };
        });
    }
  );
}

module.exports = { getVisibleVacancies };