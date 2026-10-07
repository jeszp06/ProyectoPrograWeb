let personal = [];
let materiales = [];
let otrosCostos = [];
let tareas = [];

function cargarDatos() {
    if (localStorage.getItem('personal')) personal = JSON.parse(localStorage.getItem('personal'));
    if (localStorage.getItem('materiales')) materiales = JSON.parse(localStorage.getItem('materiales'));
    if (localStorage.getItem('otrosCostos')) otrosCostos = JSON.parse(localStorage.getItem('otrosCostos'));
    if (localStorage.getItem('tareas')) tareas = JSON.parse(localStorage.getItem('tareas'));
    actualizarDashboard();
}

function guardarDatos() {
    localStorage.setItem('personal', JSON.stringify(personal));
    localStorage.setItem('materiales', JSON.stringify(materiales));
    localStorage.setItem('otrosCostos', JSON.stringify(otrosCostos));
    localStorage.setItem('tareas', JSON.stringify(tareas));
    actualizarDashboard(); 
}

function limpiarDatos() {
    if(confirm("¿Estás seguro de que deseas borrar TODOS los datos? Esta acción eliminará registros permanentemente.")) {
        personal = []; materiales = []; otrosCostos = []; tareas = [];
        localStorage.clear();
        renderizarPersonal(); renderizarMateriales(); renderizarOtrosCostos(); renderizarTareas();
        actualizarDashboard(); cerrarAsignacion();
        alert("Todos los datos han sido eliminados correctamente.");
    }
}

function mostrarSeccion(idSeccion) {
    document.querySelectorAll('.seccion').forEach(sec => sec.classList.remove('activa'));
    document.getElementById(idSeccion).classList.add('activa');
    if(idSeccion !== 'tareas') cerrarAsignacion();
    if(idSeccion === 'dashboard') actualizarDashboard(); 
}

// CRUD
function agregarPersonal(e) { e.preventDefault(); personal.push({ id: Date.now(), nombre: document.getElementById('nombrePersonal').value, costoHora: parseFloat(document.getElementById('costoHoraPersonal').value) }); guardarDatos(); document.getElementById('formPersonal').reset(); renderizarPersonal(); }
function eliminarPersonal(id) { if (tareas.some(t => t.personal && t.personal.some(x => x.id === id))) return alert('No se puede eliminar: El empleado está asignado a una tarea.'); personal = personal.filter(p => p.id !== id); guardarDatos(); renderizarPersonal(); }
function renderizarPersonal() { document.getElementById('bodyPersonal').innerHTML = personal.map(p => `<tr><td>${p.nombre}</td><td>$${p.costoHora.toFixed(2)}</td><td><button class="btn-eliminar" onclick="eliminarPersonal(${p.id})"><i class='bx bx-trash'></i> Eliminar</button></td></tr>`).join(''); }

function agregarMaterial(e) { e.preventDefault(); materiales.push({ id: Date.now(), nombre: document.getElementById('nombreMaterial').value, costoUnidad: parseFloat(document.getElementById('costoUnidadMaterial').value) }); guardarDatos(); e.target.reset(); renderizarMateriales(); }
function eliminarMaterial(id) { if (tareas.some(t => t.materiales && t.materiales.some(x => x.id === id))) return alert('No se puede eliminar: El material está en uso.'); materiales = materiales.filter(m => m.id !== id); guardarDatos(); renderizarMateriales(); }
function renderizarMateriales() { document.getElementById('bodyMateriales').innerHTML = materiales.map(m => `<tr><td>${m.nombre}</td><td>$${m.costoUnidad.toFixed(2)}</td><td><button class="btn-eliminar" onclick="eliminarMaterial(${m.id})"><i class='bx bx-trash'></i> Eliminar</button></td></tr>`).join(''); }

function agregarOtroCosto(e) { e.preventDefault(); otrosCostos.push({ id: Date.now(), concepto: document.getElementById('conceptoOtroCosto').value, costoUnidad: parseFloat(document.getElementById('costoUnidadOtroCosto').value) }); guardarDatos(); e.target.reset(); renderizarOtrosCostos(); }
function eliminarOtroCosto(id) { if (tareas.some(t => t.otrosCostos && t.otrosCostos.some(x => x.id === id))) return alert('No se puede eliminar: El gasto está en uso.'); otrosCostos = otrosCostos.filter(c => c.id !== id); guardarDatos(); renderizarOtrosCostos(); }
function renderizarOtrosCostos() { document.getElementById('bodyOtrosCostos').innerHTML = otrosCostos.map(c => `<tr><td>${c.concepto}</td><td>$${c.costoUnidad.toFixed(2)}</td><td><button class="btn-eliminar" onclick="eliminarOtroCosto(${c.id})"><i class='bx bx-trash'></i> Eliminar</button></td></tr>`).join(''); }

// TAREAS
function agregarTarea(e) {
    e.preventDefault();
    const fI = document.getElementById('fechaInicioTarea').value; const fF = document.getElementById('fechaFinTarea').value;
    if (fI > fF) return alert('Error: La fecha de inicio no puede ser mayor a la fecha de fin.');
    tareas.push({ id: Date.now(), nombre: document.getElementById('nombreTarea').value, fechaInicio: fI, fechaFin: fF, estado: 'pendiente', personal: [], materiales: [], otrosCostos: [] });
    guardarDatos(); e.target.reset(); renderizarTareas();
}
function eliminarTarea(id) { const t = tareas.find(x => x.id === id); if (t.personal.length > 0 || t.materiales.length > 0 || t.otrosCostos.length > 0) return alert('No se puede eliminar: La tarea tiene recursos asignados.'); tareas = tareas.filter(x => x.id !== id); guardarDatos(); renderizarTareas(); cerrarAsignacion(); }
function marcarConcluida(id) { const t = tareas.find(x => x.id === id); if(t) { t.estado = 'concluida'; guardarDatos(); renderizarTareas(); } }

function renderizarTareas() { 
    document.getElementById('bodyTareas').innerHTML = tareas.map(t => `
        <tr>
            <td>${t.nombre}</td>
            <td>${t.fechaInicio} / ${t.fechaFin}</td>
            <td><span class="${t.estado === 'concluida' ? 'estado-concluida' : 'estado-pendiente'}">${t.estado}</span></td>
            <td>
                <button class="btn-accion btn-observar" onclick="observarTarea(${t.id})"><i class='bx bx-show'></i> Observar</button>
                <button class="btn-accion" onclick="abrirAsignacion(${t.id})">Recursos</button>
                ${t.estado !== 'concluida' ? `<button class="btn-accion btn-concluir" onclick="marcarConcluida(${t.id})"><i class='bx bx-check'></i> Concluir</button>` : ''}
                <button class="btn-eliminar" onclick="eliminarTarea(${t.id})"><i class='bx bx-trash'></i> Eliminar</button>
            </td>
        </tr>
    `).join(''); 
}

// FUNCIONES DEL MODAL "OBSERVAR TAREA"
function observarTarea(id) {
    const t = tareas.find(x => x.id === id);
    if (!t) return;

    // Título del Modal
    document.getElementById('modalTituloTarea').innerHTML = `<i class='bx bx-search-alt-2'></i> Detalles: ${t.nombre}`;
    
    let htmlDetalles = `<div class="detalle-grid">`;
    
    // 1. Calcular y mostrar Personal
    let costoTotalPers = 0;
    htmlDetalles += `<div class="detalle-col"><h4><i class='bx bx-user'></i> Personal Asignado</h4><ul>`;
    if(t.personal.length === 0) htmlDetalles += `<li><i>Sin asignar</i></li>`;
    t.personal.forEach(p => {
        const emp = personal.find(e => e.id === p.id);
        if(emp) {
            let costo = emp.costoHora * p.horas;
            costoTotalPers += costo;
            htmlDetalles += `<li>${emp.nombre} - ${p.horas}h <strong>($${costo.toFixed(2)})</strong></li>`;
        }
    });
    htmlDetalles += `</ul><p class="subtotal">Subtotal: $${costoTotalPers.toFixed(2)}</p></div>`;

    // 2. Calcular y mostrar Materiales
    let costoTotalMat = 0;
    htmlDetalles += `<div class="detalle-col"><h4><i class='bx bx-cube'></i> Materiales</h4><ul>`;
    if(t.materiales.length === 0) htmlDetalles += `<li><i>Sin asignar</i></li>`;
    t.materiales.forEach(m => {
        const mat = materiales.find(x => x.id === m.id);
        if(mat) {
            let costo = mat.costoUnidad * m.cantidad;
            costoTotalMat += costo;
            htmlDetalles += `<li>${mat.nombre} - x${m.cantidad} <strong>($${costo.toFixed(2)})</strong></li>`;
        }
    });
    htmlDetalles += `</ul><p class="subtotal">Subtotal: $${costoTotalMat.toFixed(2)}</p></div>`;

    // 3. Calcular y mostrar Otros Costos
    let costoTotalOtr = 0;
    htmlDetalles += `<div class="detalle-col"><h4><i class='bx bx-receipt'></i> Otros Gastos</h4><ul>`;
    if(t.otrosCostos.length === 0) htmlDetalles += `<li><i>Sin asignar</i></li>`;
    t.otrosCostos.forEach(o => {
        const otr = otrosCostos.find(x => x.id === o.id);
        if(otr) {
            let costo = otr.costoUnidad * o.cantidad;
            costoTotalOtr += costo;
            htmlDetalles += `<li>${otr.concepto} - x${o.cantidad} <strong>($${costo.toFixed(2)})</strong></li>`;
        }
    });
    htmlDetalles += `</ul><p class="subtotal">Subtotal: $${costoTotalOtr.toFixed(2)}</p></div>`;
    
    htmlDetalles += `</div>`;
    
    // Gran Total
    let granTotal = costoTotalPers + costoTotalMat + costoTotalOtr;
    htmlDetalles += `<div class="detalle-total"><h3>Costo Total Invertido: $${granTotal.toFixed(2)}</h3></div>`;

    // Inyectar en el HTML y mostrar
    document.getElementById('modalContenidoTarea').innerHTML = htmlDetalles;
    document.getElementById('modalObservar').style.display = 'flex';
}

function cerrarModalObservar() {
    document.getElementById('modalObservar').style.display = 'none';
}

// ASIGNACIÓN DE RECURSOS
function abrirAsignacion(id) {
    const t = tareas.find(x => x.id === id);
    document.getElementById('idTareaActual').value = t.id; document.getElementById('tituloAsignacion').innerText = 'Asignar Recursos a: ' + t.nombre;
    document.getElementById('panelAsignacion').style.display = 'block';
    document.getElementById('selectPersonal').innerHTML = '<option value="">Seleccione...</option>' + personal.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('');
    document.getElementById('selectMaterial').innerHTML = '<option value="">Seleccione...</option>' + materiales.map(m => `<option value="${m.id}">${m.nombre}</option>`).join('');
    document.getElementById('selectOtroCosto').innerHTML = '<option value="">Seleccione...</option>' + otrosCostos.map(c => `<option value="${c.id}">${c.concepto}</option>`).join('');
    renderizarRecursos(t); document.getElementById('panelAsignacion').scrollIntoView({ behavior: 'smooth' });
}
function cerrarAsignacion() { document.getElementById('panelAsignacion').style.display = 'none'; }
function asignarPersonalTarea(e) { e.preventDefault(); const t = tareas.find(x => x.id == document.getElementById('idTareaActual').value); t.personal.push({ id: parseInt(document.getElementById('selectPersonal').value), horas: parseFloat(document.getElementById('horasPersonal').value) }); guardarDatos(); document.getElementById('horasPersonal').value = ''; renderizarRecursos(t); }
function asignarMaterialTarea(e) { e.preventDefault(); const t = tareas.find(x => x.id == document.getElementById('idTareaActual').value); t.materiales.push({ id: parseInt(document.getElementById('selectMaterial').value), cantidad: parseFloat(document.getElementById('cantidadMaterial').value) }); guardarDatos(); document.getElementById('cantidadMaterial').value = ''; renderizarRecursos(t); }
function asignarOtroCostoTarea(e) { e.preventDefault(); const t = tareas.find(x => x.id == document.getElementById('idTareaActual').value); t.otrosCostos.push({ id: parseInt(document.getElementById('selectOtroCosto').value), cantidad: parseFloat(document.getElementById('cantidadOtroCosto').value) }); guardarDatos(); document.getElementById('cantidadOtroCosto').value = ''; renderizarRecursos(t); }
function renderizarRecursos(t) {
    document.getElementById('listaPersonalTarea').innerHTML = t.personal.map(p => { const e = personal.find(x => x.id === p.id); return e ? `<li>${e.nombre} - ${p.horas}h</li>` : ''; }).join('');
    document.getElementById('listaMaterialTarea').innerHTML = t.materiales.map(m => { const x = materiales.find(y => y.id === m.id); return x ? `<li>${x.nombre} - Cant: ${m.cantidad}</li>` : ''; }).join('');
    document.getElementById('listaOtroCostoTarea').innerHTML = t.otrosCostos.map(o => { const c = otrosCostos.find(x => x.id === o.id); return c ? `<li>${c.concepto} - Cant: ${o.cantidad}</li>` : ''; }).join('');
}

// DASHBOARD
function actualizarDashboard() {
    let estPers = 0, estMat = 0, estOtr = 0;
    let realPers = 0, realMat = 0, realOtr = 0;
    let concluidas = 0;
    let controlHorasDiarias = {}; 

    tareas.forEach(t => {
        let costoTPers = 0, costoTMat = 0, costoTOtr = 0;
        const esReal = (t.estado === 'concluida');
        if(esReal) concluidas++;

        const d1 = new Date(t.fechaInicio); const d2 = new Date(t.fechaFin);
        let dias = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
        if(dias <= 0) dias = 1;

        t.personal.forEach(p => {
            const emp = personal.find(e => e.id === p.id);
            if(emp) {
                costoTPers += (emp.costoHora * p.horas);
                const horasPorDia = p.horas / dias;
                if(!controlHorasDiarias[emp.nombre]) controlHorasDiarias[emp.nombre] = [];
                controlHorasDiarias[emp.nombre].push({ tarea: t.nombre, horasDia: horasPorDia });
            }
        });

        t.materiales.forEach(m => { const mat = materiales.find(x => x.id === m.id); if(mat) costoTMat += (mat.costoUnidad * m.cantidad); });
        t.otrosCostos.forEach(o => { const otr = otrosCostos.find(x => x.id === o.id); if(otr) costoTOtr += (otr.costoUnidad * o.cantidad); });

        estPers += costoTPers; estMat += costoTMat; estOtr += costoTOtr;
        if(esReal) { realPers += costoTPers; realMat += costoTMat; realOtr += costoTOtr; }
    });

    document.getElementById('dashPersEst').innerText = estPers.toFixed(2); document.getElementById('dashPersReal').innerText = realPers.toFixed(2);
    document.getElementById('dashMatEst').innerText = estMat.toFixed(2); document.getElementById('dashMatReal').innerText = realMat.toFixed(2);
    document.getElementById('dashOtrosEst').innerText = estOtr.toFixed(2); document.getElementById('dashOtrosReal').innerText = realOtr.toFixed(2);
    document.getElementById('dashTotalEst').innerText = (estPers + estMat + estOtr).toFixed(2);
    document.getElementById('dashTotalReal').innerText = (realPers + realMat + realOtr).toFixed(2);

    const porcentaje = tareas.length > 0 ? Math.round((concluidas / tareas.length) * 100) : 0;
    const barra = document.getElementById('barraProgreso');
    barra.style.width = '0%'; 
    setTimeout(() => {
        barra.style.width = porcentaje + '%';
        barra.innerText = porcentaje + '%';
        barra.style.backgroundColor = porcentaje === 100 ? '#10b981' : (porcentaje > 50 ? '#3b82f6' : '#f59e0b');
    }, 100);

    const alertas = document.getElementById('contenedorAlertas');
    alertas.innerHTML = '';
    for (let empNombre in controlHorasDiarias) {
        let totalDiario = controlHorasDiarias[empNombre].reduce((sum, val) => sum + val.horasDia, 0);
        if (totalDiario > 8) {
            alertas.innerHTML += `<div class="alerta-item"><i class='bx bx-error-circle'></i> <div><strong>Atención:</strong> El empleado <b>${empNombre}</b> está sobreutilizado. Suma en promedio ${totalDiario.toFixed(1)} horas diarias asignadas.</div></div>`;
        }
    }
}

cargarDatos();
renderizarPersonal(); renderizarMateriales(); renderizarOtrosCostos(); renderizarTareas();