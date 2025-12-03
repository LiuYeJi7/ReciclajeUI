// Variable global para mantener el intervalo de simulación
let alertSimulatorInterval = null; 

// 4. Funciones de Modal... (otras funciones)

// --- NUEVA LÓGICA DE SIMULACIÓN ---

// Mantiene un contador para generar ID únicos y simular la llegada de nuevas alertas
let alertCounter = 3; 

/**
 * 5. Simula la llegada de nuevas alertas IoT (o la actualización de existentes).
 */
function simulateIoTAlert() {
    const tablaAlertas = document.getElementById('alertaCriticalList');
    if (!tablaAlertas) return; // Asegura que solo se ejecute si está en el dashboard

    // 1. Aumentar la simulación para BIN-12 (la alerta crítica existente)
    const bin12Row = document.getElementById('alert-BIN-12');
    if (bin12Row) {
        // Simulación: Cambiar el estado a "CONFIRMADA" después de 30 segundos
        setTimeout(() => {
            bin12Row.innerHTML = `
                <span class="font-semibold text-primary-dark">BIN-12: Contenedor Lleno al 95%</span>
                <span class="text-xs text-gray-500 italic">Asignada a Unidad Beta</span>
                <button onclick="markAlertResolved('ALERT-001')" class="text-green-600 hover:underline font-bold text-sm ml-auto">RESOLVER</button>
            `;
            // También actualizamos el contador principal en el dashboard
            updateAlertCount(-1); // Reducir en 1
        }, 30000); // 30 segundos
    }

    // 2. Simulación: Generar una NUEVA alerta crítica
    alertCounter++;
    const newAlertID = `ALERT-00${alertCounter}`;
    const newBinName = `BIN-${(100 + alertCounter)}`;

    // Crear el elemento de lista de la nueva alerta
    const newAlertItem = document.createElement('li');
    newAlertItem.className = 'p-3 border border-alert-critical/30 rounded-lg flex justify-between items-center bg-red-50 hover:bg-red-100 transition duration-150 animate-pulse';
    newAlertItem.id = `alert-${newBinName}`;
    newAlertItem.setAttribute('data-alert-id', newAlertID);
    newAlertItem.innerHTML = `
        <span class="font-bold text-alert-critical">🔴 ¡NUEVA! ${newBinName}: Lleno al 98%</span>
        <button onclick="openModal('asignarRecoleccion', '${newAlertID}')" class="text-alert-critical hover:underline font-bold text-sm">ASIGNAR AHORA</button>
    `;
    
    // Insertar la nueva alerta al principio de la lista
    tablaAlertas.prepend(newAlertItem);

    // Actualizar el contador de tarjetas (metric card)
    updateAlertCount(1); // Aumentar en 1
    
    // Eliminar la animación de pulso después de un breve tiempo
    setTimeout(() => {
        newAlertItem.classList.remove('animate-pulse');
    }, 5000);

    console.log(`[IoT Simulación] Nueva Alerta Crítica generada: ${newBinName}`);
}


/**
 * 6. Actualiza el contador en la tarjeta principal de métricas.
 */
function updateAlertCount(change) {
    const card = document.querySelector('.border-alert-critical .text-4xl');
    let currentCount = parseInt(card.textContent);
    currentCount += change;
    card.textContent = currentCount;
}

/**
 * 7. Marca una alerta como resuelta (simula la acción final).
 */
function markAlertResolved(alertId) {
    alert(`Alerta ${alertId} marcada como resuelta. Proceso completado.`);
    
    // Eliminar la fila de la alerta de la lista
    const rowToRemove = document.querySelector(`li[data-alert-id="${alertId}"]`);
    if (rowToRemove) {
        rowToRemove.remove();
    }
    
    // Opcional: Reducir el contador si la alerta no se había reducido antes
    const card = document.querySelector('.border-alert-critical .text-4xl');
    let currentCount = parseInt(card.textContent);
    if (currentCount > 0) {
         card.textContent = currentCount - 1;
    }
}

// 8. Reinicializa o inicia el gráfico y la simulación
function initializeDashboard() {
    // 1. Inicializar el gráfico (siempre)
    initializeReciclajeChart(); 
    
    // 2. Iniciar la simulación de alertas (polling cada 60 segundos)
    if (alertSimulatorInterval) {
        clearInterval(alertSimulatorInterval); // Limpiar si ya existe
    }
    // La primera alerta crítica se genera 5 segundos después de cargar el dashboard
    alertSimulatorInterval = setInterval(simulateIoTAlert, 60000); // Genera una nueva alerta cada 60 segundos
    
    // Mensaje de feedback
    console.log("Dashboard Inicializado. Simulación IoT activa (una nueva alerta cada 60s).");
}
