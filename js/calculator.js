// --- Логика калькулятора (адаптированная) ---
document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("calculator-form");
    const massInput = document.getElementById("mass");
    const alloySelect = document.getElementById("alloy");
    const machiningCheckbox = document.getElementById("machining");
    const certificateCheckbox = document.getElementById("certificate");
    const resultDiv = document.getElementById("result");

    let data;
    try {
        // Загружаем данные из data.json
        const response = await fetch("data.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        data = await response.json();
    } catch (e) {
        console.error("Ошибка загрузки данных:", e);
        resultDiv.textContent = "Ошибка загрузки данных";
        return; // Прерываем выполнение, если данные не загрузились
    }

    // Заполнение списка сплавов
    data.alloys.forEach((alloy) => {
        const option = document.createElement("option");
        option.value = alloy.name;
        option.textContent = `${alloy.name} (${alloy.price_per_kg} руб./кг)`;
        alloySelect.appendChild(option);
    });

    // Функция пересчета цены
    const calculatePrice = () => {
        const mass = parseFloat(massInput.value);
        if (!mass || mass <= 0) {
            resultDiv.textContent = "Цена: — руб.";
            return;
        }

        const selectedAlloyName = alloySelect.value;
        const selectedAlloy = data.alloys.find(a => a.name === selectedAlloyName);

        if (!selectedAlloy) {
            resultDiv.textContent = "Цена: — руб.";
            return;
        }

        let price = mass * selectedAlloy.price_per_kg;

        if (machiningCheckbox.checked) {
            price *= data.coefficients.machining;
        }

        if (certificateCheckbox.checked) {
            price *= data.coefficients.certificate;
        }

        resultDiv.textContent = `Цена: ${price.toFixed(2)} руб.`;
    };

    // Обновление при изменении полей
    [massInput, alloySelect, machiningCheckbox, certificateCheckbox].forEach(el => {
        el.addEventListener("change", calculatePrice);
    });

    // Блокировка отправки формы (необязательно, так как кнопка просто триггерит расчет)
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        // calculatePrice(); // Можно вызвать расчет еще раз при submit, если нужно
    });

    // --- Логика открытия/закрытия модального окна (добавляем сюда) ---
    const modal = document.getElementById("calculatorModal");
    const triggerBtn = document.getElementById("calculatorTriggerButton");
    const span = document.querySelector("#calculatorModal .close");

    // Функция для открытия модального окна
    function openCalculator() {
        modal.style.display = "block";
        // Сброс формы при открытии (опционально)
        form.reset();
        resultDiv.textContent = "Цена: — руб.";
    }

    // Функция для закрытия модального окна
    function closeCalculator() {
        modal.style.display = "none";
    }

    // Привязываем обработчики событий к кнопке открытия и закрытия
    if (triggerBtn && modal && span) { // Проверяем, существуют ли элементы
        triggerBtn.onclick = openCalculator;
        span.onclick = closeCalculator;

        // Закрытие при клике вне содержимого окна
        window.onclick = function(event) {
            if (event.target === modal) {
                closeCalculator();
            }
        }
    } else {
        console.error("Не найдены элементы для калькулятора или модального окна.");
    }
});