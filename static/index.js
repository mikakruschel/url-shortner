const respP = document.querySelector('#responseP');

document.querySelector('form').addEventListener('submit', e => {
  fetch('/url', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      short: document.querySelector('#inputShort').value,
      long: document.querySelector('#inputLong').value,
    }),
  })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          respP.innerHTML = data.message || 'Unkown error';
          respP.classList.add('text-danger');
          respP.classList.remove('text-primary');
        } else {
          respP.innerHTML = `Url was shortened to <a class="link-success" href="/${data.short}">mü.xyz/${data.short}</a>`;
          respP.classList.add('text-primary');
          respP.classList.remove('text-danger');
        }
      })
      .catch(err => {
        respP.innerHTML = err.message || err || 'Unkown error';
        respP.classList.add('text-primary');
        respP.classList.remove('text-danger');
      });
  e.preventDefault();
});
