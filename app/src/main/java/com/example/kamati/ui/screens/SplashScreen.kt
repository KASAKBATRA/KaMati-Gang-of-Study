package com.example.kamati.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.kamati.R
import com.example.kamati.ui.theme.CyanPrimary
import com.example.kamati.ui.theme.DarkBackground
import kotlinx.coroutines.delay

private const val EN_QUOTE = "Knowledge is not just learned, it is received with humility."
private const val HI_QUOTE = "ज्ञान केवल पढ़ने से नहीं मिलता, उसे विनम्रता से ग्रहण करना पड़ता है।"

@Composable
fun SplashScreen(
    onFinishSplash: () -> Unit,
    modifier: Modifier = Modifier
) {
    var typedText by remember { mutableStateOf("") }
    var showHindi by remember { mutableStateOf(false) }
    var showLoadingDots by remember { mutableStateOf(false) }
    var startZoom by remember { mutableStateOf(false) }

    // Typewriter effect
    LaunchedEffect(Unit) {
        for (i in 1..EN_QUOTE.length) {
            typedText = EN_QUOTE.substring(0, i)
            delay(30)
        }
        delay(300)
        showHindi = true
        delay(400)
        showLoadingDots = true
        delay(600)
        startZoom = true
        delay(700)
        onFinishSplash()
    }

    val logoScale by animateFloatAsState(
        targetValue = if (startZoom) 1.15f else 1.0f,
        animationSpec = tween(durationMillis = 600, easing = FastOutSlowInEasing),
        label = "logoScale"
    )

    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val auraAlpha by infiniteTransition.animateFloat(
        initialValue = 0.4f,
        targetValue = 0.85f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "auraAlpha"
    )

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(DarkBackground)
            .clickable { onFinishSplash() },
        contentAlignment = Alignment.Center
    ) {
        // Decorative radial ambient glow
        Box(
            modifier = Modifier
                .size(320.dp)
                .blur(80.dp)
                .background(
                    Brush.radialGradient(
                        colors = listOf(CyanPrimary.copy(alpha = 0.35f), Color.Transparent)
                    ),
                    shape = CircleShape
                )
        )

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp)
        ) {
            // Glowing Logo with Aura
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(130.dp)
                    .scale(logoScale)
            ) {
                // Aura ring
                Box(
                    modifier = Modifier
                        .size(120.dp)
                        .clip(CircleShape)
                        .background(CyanPrimary.copy(alpha = auraAlpha * 0.35f))
                        .blur(16.dp)
                )

                // Logo icon
                Box(
                    modifier = Modifier
                        .size(96.dp)
                        .clip(CircleShape)
                        .background(Color(0xFF111827)),
                    contentAlignment = Alignment.Center
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.app_logo),
                        contentDescription = "KaMaTi Logo",
                        modifier = Modifier.size(80.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            // Quotes
            Text(
                text = typedText,
                style = MaterialTheme.typography.titleMedium.copy(
                    fontSize = 17.sp,
                    fontStyle = FontStyle.Italic,
                    lineHeight = 24.sp,
                    textAlign = TextAlign.Center
                ),
                color = Color(0xFFF9FAFB),
                modifier = Modifier.fillMaxWidth(0.9f)
            )

            if (showHindi) {
                Spacer(modifier = Modifier.height(14.dp))
                Text(
                    text = HI_QUOTE,
                    style = MaterialTheme.typography.bodyLarge.copy(
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Medium,
                        lineHeight = 22.sp,
                        textAlign = TextAlign.Center
                    ),
                    color = CyanPrimary,
                    modifier = Modifier.fillMaxWidth(0.9f)
                )
            }

            Spacer(modifier = Modifier.height(36.dp))

            // Loading dots
            if (showLoadingDots) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    repeat(3) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .clip(CircleShape)
                                .background(CyanPrimary)
                        )
                    }
                }
            } else {
                Spacer(modifier = Modifier.height(8.dp))
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Signature
            Text(
                text = "By KaMaTi Gang 😁",
                style = MaterialTheme.typography.labelSmall.copy(
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    letterSpacing = 1.sp
                ),
                color = Color(0xFF9CA3AF)
            )
        }
    }
}
