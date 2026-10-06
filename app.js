let personal = [];
let materiales = [];
let otrosCostos = [];
let tareas = [];

// Persistencia
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
    actualizarDashboard(); // Recalcula los gráficos al guardar
}

function mostrarSeccion(idSeccion) {
    document.querySelectorAll('.seccion').forEach(sec => sec.classList.remove('activa'));
    document.getElementById(idSeccion).classList.add('activa');
    if(idSeccion !== 'tareas') cerrarAsignacion();
    if(idSeccion === 'dashboard') actualizarDashboard(); // Activa animación al entrar
}

// ==========================================
// MÓDULOS CRUD BASE
// ==========================================
function agregarPersonal(e) { e.preventDefault(); personal.push({ id: Date.now(), nombre: document.getElementById('nombrePersonal').value, costoHora: parseFloat(document.getElementById('costoHoraPersonal').value) }); guardarDatos(); document.getElementById('formPersonal').reset(); renderizarPersonal(); }
function eliminarPersonal(id) { if (tareas.some(t => t.personal && t.personal.some(x => x.id === id))) return alert('❌ En uso.'); personal = personal.filter(p => p.id !== id); guardarDatos(); renderizarPersonal(); }
function renderizarPersonal() { document.getElementById('bodyPersonal').innerHTML = personal.map(p => `<tr><td>${p.nombre}</td><td>$${p.costoHora.toFixed(2)}</td><td><button class="btn-eliminar" onclick="eliminarPersonal(${p.id})">Eliminar</button></td></tr>`).join(''); }

function agregarMaterial(e) { e.preventDefault(); materiales.push({ id: Date.now(), nombre: document.getElementById('nombreMaterial').value, costoUnidad: parseFloat(document.getElementById('costoUnidadMaterial').value) }); guardarDatos(); e.target.reset(); renderizarMateriales(); }
function eliminarMaterial(id) { if (tareas.some(t => t.materiales && t.materiales.some(x => x.id === id))) return alert('❌ En uso.'); materiales = materiales.filter(m => m.id !== id); guardarDatos(); renderizarMateriales(); }
function renderizarMateriales() { document.getElementById('bodyMateriales').innerHTML = materiales.map(m => `<tr><td>${m.nombre}</td><td>$${m.costoUnidad.toFixed(2)}</td><td><button class="btn-eliminar" onclick="eliminarMaterial(${m.id})">Eliminar</button></td></tr>`).join(''); }

function agregarOtroCosto(e) { e.preventDefault(); otrosCostos.push({ id: Date.now(), concepto: document.getElementById('conceptoOtroCosto').value, costoUnidad: parseFloat(document.getElementById('costoUnidadOtroCosto').value) }); guardarDatos(); e.target.reset(); renderizarOtrosCostos(); }
function eliminarOtroCosto(id) { if (tareas.some(t => t.otrosCostos && t.otrosCostos.some(x => x.id === id))) return alert('❌ En uso.'); otrosCostos = otrosCostos.filter(c => c.id !== id); guardarDatos(); renderizarOtrosCostos(); }
function renderizarOtrosCostos() { document.getElementById('bodyOtrosCostos').innerHTML = otrosCostos.map(c => `<tr><td>${c.concepto}</td><td>$${c.costoUnidad.toFixed(2)}</td><td><button class="btn-eliminar" onclick="eliminarOtroCosto(${c.id})">Eliminar</button></td></tr>`).join(''); }

// ==========================================
// TAREAS Y ASIGNACIÓN
// ==========================================
function agregarTarea(e) {
    e.preventDefault();
    const fI = document.getElementById('fechaInicioTarea').value; const fF = document.getElementById('fechaFinTarea').value;
    if (fI > fF) return alert('❌ Fecha inicio mayor a fin.');
    tareas.push({ id: Date.now(), nombre: document.getElementById('nombreTarea').value, fechaInicio: fI, fechaFin: fF, estado: 'pendiente', personal: [], materiales: [], otrosCostos: [] });
    guardarDatos(); e.target.reset(); renderizarTareas();
}
function eliminarTarea(id) { const t = tareas.find(x => x.id === id); if (t.personal.length > 0 || t.materiales.length > 0 || t.otrosCostos.length > 0) return alert('❌ Tarea con recursos asignados.'); tareas = tareas.filter(x => x.id !== id); guardarDatos(); renderizarTareas(); cerrarAsignacion(); }
function marcarConcluida(id) { const t = tareas.find(x => x.id === id); if(t) { t.estado = 'concluida'; guardarDatos(); renderizarTareas(); } }
function renderizarTareas() { document.getElementById('bodyTareas').innerHTML = tareas.map(t => `<tr><td>${t.nombre}</td><td>${t.fechaInicio} / ${t.fechaFin}</td><td><span class="${t.estado === 'concluida' ? 'estado-concluida' : 'estado-pendiente'}">${t.estado}</span></td><td><button class="btn-accion" onclick="abrirAsignacion(${t.id})">Recursos</button>${t.estado !== 'concluida' ? `<button class="btn-accion btn-concluir" onclick="marcarConcluida(${t.id})">Concluir</button>` : ''}<button class="btn-eliminar" onclick="eliminarTarea(${t.id})">Eliminar</button></td></tr>`).join(''); }

function abrirAsignacion(id) {
    const t = tareas.find(x => x.id === id);
    document.getElementById('idTareaActual').value = t.id; document.getElementById('tituloAsignacion').innerText = 'Asignar a: ' + t.nombre;
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

// ==========================================
// LÓGICA DEL DASHBOARD (MATEMÁTICAS)
// ==========================================
function actualizarDashboard() {
    let estPers = 0, estMat = 0, estOtr = 0;
    let realPers = 0, realMat = 0, realOtr = 0;
    let concluidas = 0;
    let controlHorasDiarias = {}; // Para calcular sobreutilización

    tareas.forEach(t => {
        let costoTPers = 0, costoTMat = 0, costoTOtr = 0;
        const esReal = (t.estado === 'concluida');
        if(esReal) concluidas++;

        // Días de la tarea (para dividir las horas)
        const d1 = new Date(t.fechaInicio); const d2 = new Date(t.fechaFin);
        let dias = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
        if(dias <= 0) dias = 1;

        // Cálculos Personal y Sobrecarga
        t.personal.forEach(p => {
            const emp = personal.find(e => e.id === p.id);
            if(emp) {
                costoTPers += (emp.costoHora * p.horas);
                
                // Algoritmo de sobreutilización (horas por día)
                const horasPorDia = p.horas / dias;
                if(!controlHorasDiarias[emp.nombre]) controlHorasDiarias[emp.nombre] = [];
                controlHorasDiarias[emp.nombre].push({ tarea: t.nombre, horasDia: horasPorDia });
            }
        });

        // Cálculos Materiales
        t.materiales.forEach(m => {
            const mat = materiales.find(x => x.id === m.id);
            if(mat) costoTMat += (mat.costoUnidad * m.cantidad);
        });

        // Cálculos Otros Costos
        t.otrosCostos.forEach(o => {
            const otr = otrosCostos.find(x => x.id === o.id);
            if(otr) costoTOtr += (otr.costoUnidad * o.cantidad);
        });

        estPers += costoTPers; estMat += costoTMat; estOtr += costoTOtr;
        if(esReal) { realPers += costoTPers; realMat += costoTMat; realOtr += costoTOtr; }
    });

    // 1. Llenar Tarjetas
    document.getElementById('dashPersEst').innerText = estPers.toFixed(2); document.getElementById('dashPersReal').innerText = realPers.toFixed(2);
    document.getElementById('dashMatEst').innerText = estMat.toFixed(2); document.getElementById('dashMatReal').innerText = realMat.toFixed(2);
    document.getElementById('dashOtrosEst').innerText = estOtr.toFixed(2); document.getElementById('dashOtrosReal').innerText = realOtr.toFixed(2);
    document.getElementById('dashTotalEst').innerText = (estPers + estMat + estOtr).toFixed(2);
    document.getElementById('dashTotalReal').innerText = (realPers + realMat + realOtr).toFixed(2);

    // 2. Barra de Avance (con animación)
    const porcentaje = tareas.length > 0 ? Math.round((concluidas / tareas.length) * 100) : 0;
    const barra = document.getElementById('barraProgreso');
    barra.style.width = '0%'; // Resetea para activar transición
    setTimeout(() => {
        barra.style.width = porcentaje + '%';
        barra.innerText = porcentaje + '%';
        barra.style.backgroundColor = porcentaje === 100 ? '#27ae60' : (porcentaje > 50 ? '#3498db' : '#e67e22');
    }, 100);

    // 3. Evaluar Sobrecarga
    const alertas = document.getElementById('contenedorAlertas');
    alertas.innerHTML = '';
    for (let empNombre in controlHorasDiarias) {
        let totalDiario = controlHorasDiarias[empNombre].reduce((sum, val) => sum + val.horasDia, 0);
        if (totalDiario > 8) {
            alertas.innerHTML += `<div class="alerta-item">⚠️ <strong>Alerta:</strong> El empleado <b>${empNombre}</b> está sobreutilizado. Suma en promedio ${totalDiario.toFixed(1)} horas diarias asignadas.</div>`;
        }
    }
}

// INICIO
cargarDatos();
renderizarPersonal(); renderizarMateriales(); renderizarOtrosCostos(); renderizarTareas();